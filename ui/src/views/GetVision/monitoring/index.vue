<template>
  <div class="row mt-4 mb-4">
    <div :key="'bar_' + currentUsage" class="col-3">
      <MonitoringIndicators
        :can-refresh="canShowIndicators"
        :applied-filters="appliedFilters"
        :usage="currentUsage"
        @click="onIndicatorClick"
      />
      <FilterBar
        v-if="filters"
        :filter-components="filters"
        @applyFilters="doSearch"
        @noMoreFilters="onAllFiltersCleared"
        always-show-button
        :disabled="!canFilter"
        :default-values="defaultValues"
      />
    </div>
    <div class="col-9">
      <div class="bg-white p-3">
        <div class="row">
          <div class="col-7">
            <label class="font-weight-bold">Type de supervision</label>
            <Toggle
              v-if="toggleValues"
              @update="currentUsage = $event.id"
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
            />
          </div>
        </template>
        <template v-else>
          <SupervisionMap
            :visible="!refreshLinesFn"
            :applied-filters="appliedFilters"
            :usage="currentUsage"
            @activeClick="onActiveClick"
            @passiveClick="onPassiveClick"
            @cockpitClick="onCockpitClick"
          />
          <SupervisionTable
            v-if="refreshLinesFn"
            :refresh-lines-fn="refreshLinesFn"
            :total="indicatorTotal"
            @gotomap="refreshLinesFn = undefined"
          />
        </template>
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
import MapLegend from './MapLegend';
import MonitoringIndicators from './MonitoringIndicators';
import cloneDeep from 'lodash.clonedeep';

import SupervisionMap from './SupervisionMap';
import SupervisionTable from './SupervisionTable';
import CockpitDetails from './CockpitDetails';

import { fetchLinesForCounter, fetchLinesForMarker } from '@/api/supervision.js';

import { mapGetters } from 'vuex';

import { shouldFilterMocked } from '@/featureFlipping/plugin.js';

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
      return !this.cockpitMarkerToDetail && !this.refreshLinesFn;
    },
  },
  data() {
    return {
      filters: undefined,
      toggleValues: undefined,
      currentUsage: 'ALL',
      appliedFilters: undefined,
      refreshLinesFn: undefined,
      indicatorTotal: undefined,
      canShowIndicators: false,
      cockpitMarkerToDetail: undefined,
      defaultValues: undefined,

      commonFilters: {
        partnerGroup: {
          title: 'getadmin.users.filters.partnerGroup',
          component: PartnerGroupChoice,
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
          onChange(chosenValue, clearFilter) {
            clearFilter('filters.offers');
            return {
              id: 'getadmin.users.filters.partners',
              value: chosenValue ? chosenValue.label : '',
              data: chosenValue,
            };
          },
          onRemove(clearFilter) {
            console.log('Removing Filter>>');
            clearFilter('filters.offers');
          },
        },
        offers: {
          title: 'filters.offers',
          component: OfferFilter,
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
    currentUsage() {
      this.appliedFilters = undefined;
      this.refreshLinesFn = undefined;
      this.indicatorTotal = undefined;
      this.canShowIndicators = false;
      this.cockpitMarkerToDetail = undefined;

      if (this.currentUsage === 'COCKPIT') {
        this.filters = this.getCockpitFilters();
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
    ];
  },

  methods: {
    doSearch(appliedFilters) {
      this.appliedFilters = cloneDeep(appliedFilters);
      this.canShowIndicators = true;
    },
    onAllFiltersCleared() {},

    getCockpitFilters() {
      const currentVisibleFilters = [];
      if (this.userIsBO) {
        currentVisibleFilters.push(this.commonFilters.partnerGroup);
      }

      if (this.userIsBO || this.userIsGroupAccount || this.userPartyGroup) {
        currentVisibleFilters.push(this.commonFilters.partners);
      }

      currentVisibleFilters.push(this.commonFilters.offers);

      currentVisibleFilters.push({
        title: 'filters.country',
        component: CountryFilter,
        onChange(chosenValue) {
          const country = chosenValue ? chosenValue.label : undefined;

          return {
            id: 'filters.country',
            value: country,
            data: chosenValue,
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

      if (this.userIsBO || this.userIsGroupAccount || this.userPartyGroup) {
        currentVisibleFilters.push(this.commonFilters.partners);
      } else if (this.userIsPartner) {
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

      currentVisibleFilters.push({
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
      });

      return currentVisibleFilters;
    },

    onIndicatorClick(payload) {
      const { indicator, total } = payload;
      const usage = this.currentUsage;
      const counter = indicator.counter;
      this.indicatorTotal = total;

      this.refreshLinesFn = undefined;

      setTimeout(() => {
        this.refreshLinesFn = async (pagination, sorting) => {
          return await fetchLinesForCounter(counter, usage, pagination, sorting);
        };
      });
    },

    onActiveClick(payload) {
      this.onMarkerClick(payload, 'ACTIVE');
      this.indicatorTotal = payload.marker.activeCount;
    },

    onPassiveClick(payload) {
      this.onMarkerClick(payload, 'PASSIVE');
      this.indicatorTotal = payload.marker.activeCount;
    },

    onMarkerClick(payload, activityType) {
      const { marker, locationType } = payload;

      this.refreshLinesFn = async (pagination, sorting) => {
        const formattedAppliedFilters = filterFormatter(this.appliedFilters || []);

        const filters = {
          usageType: this.currentUsage,
          activityType,
          ...formattedAppliedFilters,
        };

        filters.locationCodes = [marker.data.locationCode];
        const rows = await fetchLinesForMarker(locationType, filters, pagination, sorting);
        return rows;
      };
    },

    onCockpitClick(payload) {
      if (!shouldFilterMocked()) {
        this.cockpitMarkerToDetail = payload;
      }
    },
  },
};

export function filterFormatter(appliedFilters) {
  return appliedFilters.reduce((filters, item) => {
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

    if (item.id === 'filters.zone') {
      if (item.data.zone.world) {
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
    return filters;
  }, {});
}
</script>

<style lang="scss" scoped></style>
