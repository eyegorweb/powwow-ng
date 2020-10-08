<template>
  <div class="row mt-4 mb-4">
    <div :key="'bar_' + currentUsage" class="col-3">
      <MonitoringIndicators
        v-if="currentUsage !== 'ALARMS'"
        :can-refresh="canShowIndicators"
        :applied-filters="appliedFilters"
        :usage="currentUsage"
        @click="onIndicatorClick"
      />
      <FilterBar
        v-if="currentUsage !== 'ALARMS' && filters"
        :filter-components="filters"
        :disabled="!canFilter"
        :default-values="defaultValues"
        :frozen-values="frozenValues"
        always-show-button
        @applyFilters="doSearch"
        @noMoreFilters="onAllFiltersCleared"
        @currentFiltersChange="onCurrentChange"
      />
    </div>
    <div class="col-9">
      <div class="bg-white p-3">
        <div class="row">
          <div class="col-7">
            <label class="font-weight-bold">{{ $t('getvsion.supervisionType') }}</label>
            <Toggle
              v-if="toggleValues"
              @update="onUsageChange"
              :values="toggleValues"
              block
              class="pl-2"
            />
          </div>
          <div class="col-5">
            <MapLegend :usage="currentUsage" />
          </div>
        </div>
      </div>

      <div :key="'content_' + currentUsage" class="mt-3 mb-3">
        <template v-if="cockpitMarkerToDetail">
          <div>
            <CockpitDetails
              :marker-data="cockpitMarkerToDetail"
              :applied-filters="appliedFilters"
              @tabchange="onTabChange"
              @gotomap="gotoCockpitMap"
            />
          </div>
        </template>
        <div :class="{ hidden: !!cockpitMarkerToDetail }">
          <SupervisionMap
            :visible="!refreshLinesFn"
            :applied-filters="appliedFilters"
            :usage="currentUsage"
            @activeClick="onActiveClick"
            @passiveClick="onPassiveClick"
            @cockpitClick="onCockpitClick"
            @centeredCountry="lastCenteredCountry = $event"
          />
          <SupervisionTable
            v-if="refreshLinesFn"
            :refresh-lines-fn="refreshLinesFn"
            :total="indicatorTotal"
            :filters-for-export="filtersForExport"
            @gotomap="refreshLinesFn = undefined"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FilterBar from '@/components/Filters/TableWithFilter/FilterBar.vue';
import MultiCustomerPartnerFilter from './filters/MultiCustomerPartnerFilter.vue';
import OfferFilter from './filters/OfferFilter';
import Toggle from '@/components/ui/UiToggle2';
import FileFilter from './filters/FileFilter';
import PartnerGroupChoice from './filters/PartnerGroupChoice';
import LocalisationFilter from './filters/LocalisationFilter';
import CountryFilter from './filters/CountryFilter';
import StatusesFilter from './filters/StatusesFilter';
import TypesFilter from './filters/TypesFilter';
import LabelFilter from './filters/LabelFilter';
import IdentifierFilter from './filters/IdentifierFilter';

import DateRangeFilter from './filters/DateRangeFilter';
import MapLegend from './MapLegend';
import MonitoringIndicators from './MonitoringIndicators';
import cloneDeep from 'lodash.clonedeep';

import SupervisionMap from './SupervisionMap';
import SupervisionTable from './SupervisionTable';
import CockpitDetails from './CockpitDetails';

import { fetchLinesForCounter, fetchLinesForMarker } from '@/api/supervision.js';

import { mapGetters } from 'vuex';

import { fetchDeliveryCountries } from '@/api/filters';
import { delay } from '@/api/utils.js';

export default {
  components: {
    FilterBar,
    Toggle,
    MapLegend,
    MonitoringIndicators,
    SupervisionMap,
    SupervisionTable,
    CockpitDetails,
  },
  computed: {
    ...mapGetters([
      'userIsBO',
      'userIsGroupAccount',
      'userPartyGroup',
      'userIsMultiPartner',
      'userIsPartner',
      'singlePartner',
    ]),
    canFilter() {
      return !this.refreshLinesFn;
    },
  },
  data() {
    return {
      filters: undefined,
      filtersForExport: undefined,
      toggleValues: undefined,
      currentUsage: 'ALL',
      appliedFilters: undefined,
      refreshLinesFn: undefined,
      indicatorTotal: undefined,
      canShowIndicators: false,
      cockpitMarkerToDetail: undefined,
      defaultValues: [],
      currentFilters: [],
      frozenValues: [],
      isFrozen: false,
      currentTab: 'graphs',
      lastCenteredCountry: undefined,

      commonFilters: {
        partnerGroup: {
          title: 'getadmin.users.filters.partnerGroup',
          component: PartnerGroupChoice,
          isHidden: () => {
            return this.isFrozen;
          },
          onChange(chosen, clearFilter) {
            clearFilter('getadmin.users.filters.partners');
            clearFilter('filters.offers');
            if (!chosen || !chosen.value) {
              return {
                id: 'getadmin.users.filters.partnerGroup',
                value: '', // pour supprimer ce choix des filtres séléctionnés
              };
            } else {
              return {
                id: 'getadmin.users.filters.partnerGroup',
                value: chosen.label,
                data: chosen,
              };
            }
          },
        },
        partners: {
          title: 'getadmin.users.filters.partners',
          component: MultiCustomerPartnerFilter,
          isHidden: () => {
            return this.isFrozen;
          },
          onChange(chosenValue, clearFilter) {
            clearFilter('filters.offers');
            return {
              id: 'getadmin.users.filters.partners',
              value: chosenValue ? chosenValue.label : '',
              data: chosenValue,
            };
          },
          onRemove(clearFilter) {
            clearFilter('filters.offers');
          },
        },
        offers: {
          title: 'filters.offers',
          component: OfferFilter,
          isHidden: () => {
            return this.isFrozen;
          },
          onChange(chosenValue) {
            return {
              id: 'filters.offers',
              value: chosenValue ? chosenValue.label : '',
              data: chosenValue,
            };
          },
        },
      },
    };
  },

  watch: {
    cockpitMarkerToDetail() {
      if (this.cockpitMarkerToDetail) {
        this.refreshCockpitFilters();
      }
    },
    currentUsage() {
      this.appliedFilters = undefined;
      this.refreshLinesFn = undefined;
      this.indicatorTotal = undefined;
      this.canShowIndicators = false;
      this.cockpitMarkerToDetail = undefined;
      this.isFrozen = false;
      this.frozenValues = [];
      this.currentFilters = [];
      this.currentTab = 'graphs';

      if (this.currentUsage === 'COCKPIT') {
        this.refreshCockpitFilters();
      } else {
        this.filters = this.getUsageFilters();
      }
    },
  },

  mounted() {
    this.filters = this.getUsageFilters();

    this.toggleValues = [
      {
        id: 'ALL',
        label: 'getvsion.allUsages',
        default: this.value === 'ALL',
      },
      {
        id: 'DATA',
        label: 'getvsion.dataUsage',
        default: this.value === 'DATA',
      },
      {
        id: 'COCKPIT',
        label: 'getvsion.m2mCockpit',
        default: this.value === 'COCKPIT',
      },
      {
        id: 'ALARMS',
        label: 'getvsion.alarms',
        default: this.value === 'ALARMS',
      },
    ];
  },

  methods: {
    onTabChange(tab) {
      this.currentTab = tab.label;
      this.filters = undefined;
      setTimeout(() => {
        this.refreshCockpitFilters();
      });
    },

    refreshCockpitFilters() {
      this.filters = this.getCockpitFilters();
      this.filterBarVersion += 1;
    },

    onUsageChange(usage) {
      this.currentUsage = usage.id;
    },

    async preselectCountry(payload) {
      const { marker } = payload;

      if (typeof marker.data.locationCode === 'string') {
        const foundCountry = await fetchDeliveryCountries(this.$i18n.locale, {
          codeIso3: { eq: marker.data.locationCode },
        });

        if (foundCountry && foundCountry.length) {
          const filterEntry = {
            id: 'filters.country',
            value: foundCountry[0].name,
            data: foundCountry[0],
          };

          return filterEntry;
        }
      }
    },

    gotoCockpitMap() {
      this.isFrozen = false;
      this.frozenValues = [];
      this.cockpitMarkerToDetail = undefined;

      // this.appliedFilters = undefined;
      this.filters = undefined;
      setTimeout(() => {
        this.refreshCockpitFilters();
      });
    },

    async freezeFilterSelection(payload) {
      this.isFrozen = true;
      const countryFilter = await this.preselectCountry(payload);
      let frozenValues = cloneDeep(this.currentFilters);

      if (countryFilter) {
        frozenValues = frozenValues.filter(f => f.id !== 'filters.country');
        frozenValues.push(countryFilter);
      }

      this.frozenValues = frozenValues;

      const oldFilters = this.filters;

      this.filters = undefined;

      await delay(20);

      this.filters = oldFilters;
    },

    doSearch(appliedFilters) {
      this.appliedFilters = cloneDeep(appliedFilters);
      this.canShowIndicators = true;
    },
    onAllFiltersCleared() {},

    onCurrentChange(currentFilters) {
      this.currentFilters = cloneDeep(currentFilters);
    },

    getCockpitFilters() {
      const currentVisibleFilters = [];
      if (this.userIsBO) {
        currentVisibleFilters.push(this.commonFilters.partnerGroup);
      }

      if (!this.userIsPartner) {
        currentVisibleFilters.push(this.commonFilters.partners);
      }

      currentVisibleFilters.push(this.commonFilters.offers);

      currentVisibleFilters.push({
        title: 'filters.country',
        component: CountryFilter,
        isHidden: () => {
          return this.isFrozen;
        },
        onChange(chosenValue) {
          const country = chosenValue ? chosenValue.label : undefined;

          return {
            id: 'filters.country',
            value: country,
            data: chosenValue,
          };
        },
      });

      // Filters pour alerts

      // StatusesFilter

      if (this.cockpitMarkerToDetail) {
        if (this.currentTab === 'alerts') {
          const createComboFilter = (name, component) => {
            currentVisibleFilters.push({
              title: name,
              component,
              onChange(chosen) {
                if (!chosen || !chosen.value) {
                  return {
                    id: name,
                    value: '', // pour supprimer ce choix des filtres séléctionnés
                  };
                } else {
                  return {
                    id: name,
                    value: chosen.label,
                    data: chosen,
                  };
                }
              },
            });
          };

          createComboFilter('status', StatusesFilter);
          createComboFilter('types', TypesFilter);
          createComboFilter('col.label', LabelFilter);
        }
      }

      currentVisibleFilters.push({
        title: 'common.period',
        component: DateRangeFilter,
        onChange(chosen) {
          return {
            id: 'common.period',
            startDate: chosen.startDate,
            endDate: chosen.endDate,
            data: chosen,
          };
        },
      });

      return currentVisibleFilters;
    },

    getUsageFilters() {
      const currentVisibleFilters = [
        {
          title: 'getvsion.monitoring.filterByFile',
          component: FileFilter,
          onChange(chosenValue) {
            return {
              id: 'getvsion.monitoring.filterByFile',
              value: chosenValue.file.name,
              data: chosenValue,
            };
          },
        },
      ];
      if (this.userIsBO) {
        currentVisibleFilters.push(this.commonFilters.partnerGroup);
      }

      // if (this.userIsBO || this.userIsGroupAccount || this.userPartyGroup) {
      if (!this.userIsPartner) {
        currentVisibleFilters.push(this.commonFilters.partners);
      } else {
        this.defaultValues = [
          {
            id: 'getadmin.users.filters.partners',
            value: this.singlePartner ? this.singlePartner.name : '',
            data: this.singlePartner,
            hidden: true,
          },
        ];
      }

      currentVisibleFilters.push(this.commonFilters.offers);

      currentVisibleFilters.push(
        {
          title: 'filters.zone',
          component: LocalisationFilter,
          onChange(chosenValue) {
            const zone = chosenValue.zone.label;
            const country = chosenValue.country ? chosenValue.country.label : undefined;
            const zipCode = chosenValue.zipCode ? chosenValue.zipCode : undefined;

            const labels = [{ id: zone, label: `Zone: ${zone}` }];
            if (country) labels.push({ id: country, label: `Pays: ${country}` });
            if (zipCode) labels.push({ id: zipCode, label: `Code postal: ${zipCode}` });
            return {
              id: 'filters.zone',
              values: labels,
              data: chosenValue,
            };
          },
        },
        {
          title: 'common.identifier',
          component: IdentifierFilter,
          onChange(chosenValue) {
            const labels = [];

            if (chosenValue.imei) {
              labels.push({
                id: 'getparc.actDetail.col.imei',
                label: `IMEI : ${chosenValue.imei}`,
              });
            }
            if (chosenValue.msisdn) {
              labels.push({
                id: 'getparc.actDetail.col.msisdn',
                label: `MSISDN : ${chosenValue.msisdn}`,
              });
            }

            return {
              id: 'common.identifier',
              data: chosenValue,
              values: labels,
            };
          },
        }
      );

      return currentVisibleFilters;
    },

    onIndicatorClick(payload) {
      const { indicator, total } = payload;
      const usageType = this.currentUsage;
      const counter = indicator.counter;
      this.indicatorTotal = total;

      this.refreshLinesFn = undefined;
      this.filtersForExport = undefined;

      const filters = {
        counter,
        usageType,
      };
      this.filtersForExport = { ...filters };

      setTimeout(() => {
        this.refreshLinesFn = async (pagination, sorting) => {
          return await fetchLinesForCounter(this.filtersForExport, pagination, sorting);
        };
      });
    },

    onActiveClick(payload) {
      this.onMarkerClick(payload, 'ACTIVE');
      this.indicatorTotal = payload.marker.activeCount;
    },

    onPassiveClick(payload) {
      this.onMarkerClick(payload, 'PASSIVE');
      this.indicatorTotal = payload.marker.passiveCount;
    },

    getFiltersForExport(clickedMarkerData, activityType) {
      const { marker, locationType } = clickedMarkerData;
      const formattedAppliedFilters = filterFormatter(this.appliedFilters || []);

      const filters = {
        usageType: this.currentUsage,
        activityType,
        ...formattedAppliedFilters,
      };

      filters.locationCodes = [marker.data.locationCode];
      return { ...filters, locationType };
    },

    onMarkerClick(payload, activityType) {
      this.filtersForExport = this.getFiltersForExport(payload, activityType);

      this.refreshLinesFn = async (pagination, sorting) => {
        this.filtersForExport = this.getFiltersForExport(payload, activityType);
        const filtersForapi = { ...this.filtersForExport };
        delete filtersForapi.locationType;

        let locationType = this.filtersForExport.locationType;

        if (
          this.lastCenteredCountry === 'US' ||
          this.$loGet(this.filtersForExport, 'iso3CountryCode') === 'USA'
        ) {
          locationType = 'STATES';
        }

        if (this.lastCenteredCountry === 'US') {
          filtersForapi.iso3CountryCode = 'USA';
        }

        const rows = await fetchLinesForMarker(locationType, filtersForapi, pagination, sorting);
        return rows;
      };
    },

    onCockpitClick(payload) {
      this.cockpitMarkerToDetail = payload;
      this.freezeFilterSelection(payload);
    },
  },
};

export function filterFormatter(appliedFilters) {
  if (!appliedFilters) return {};

  return appliedFilters.reduce((filters, item) => {
    try {
      if (item.id === 'getadmin.users.filters.partners') {
        filters.partyId = item.data.id;
      }

      if (item.id === 'getvsion.monitoring.filterByFile') {
        filters.tempDataUuid = item.data.tempDataUuid;
      }

      if (item.id === 'filters.offers') {
        filters.offerCode = item.data.id;
      }

      if (item.id === 'getadmin.users.filters.partnerGroup') {
        filters.partiesDomain = item.data.value;
      }

      if (item.id === 'common.identifier') {
        if (item.data.imei) {
          filters.imei = '' + item.data.imei;
        }

        if (item.data.msisdn) {
          filters.msisdn = '' + item.data.msisdn;
        }
      }

      if (item.id === 'filters.zone') {
        // filters.zone = item.data.zone.value;

        if (item.data.zone.value === 'world') {
          if (item.data.country) {
            filters.iso3CountryCode = item.data.country.codeIso3;
          }
        } else {
          if (item.data.zipCode) {
            filters.zipCode = item.data.zipCode;
            filters.iso3CountryCode = 'FRA';
          }
        }
      }
    } catch (e) {
    }
    return filters;
  }, {});
}
</script>

<style lang="scss" scoped></style>
