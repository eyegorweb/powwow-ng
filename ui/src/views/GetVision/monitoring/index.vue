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
            <CockpitDetails :markerData="cockpitMarkerToDetail" :applied-filters="appliedFilters" />
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
import MapLegend from './MapLegend';
import MonitoringIndicators from './MonitoringIndicators';
import cloneDeep from 'lodash.clonedeep';

import SupervisionMap from './SupervisionMap';
import SupervisionTable from './SupervisionTable';
import CockpitDetails from './CockpitDetails';

import { fetchLinesForCounter, fetchLinesForMarker } from '@/api/supervision.js';

import { mapGetters } from 'vuex';

export default {
  components: {
    FilterBar,
    Toggle,
    MapLegend,
    MonitoringIndicators,
    SupervisionMap,
    SupervisionTable,
    CockpitDetails
  },
  computed: {
    ...mapGetters(['userIsBO', 'userIsGroupAccount']),
    canFilter() {
      return !this.cockpitMarkerToDetail && !this.refreshLinesFn;
    }
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
      cockpitMarkerToDetail: undefined
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
    onAllFiltersCleared() { },

    getCockpitFilters() {
      const currentVisibleFilters = [];
      if (this.userIsBO) {
        currentVisibleFilters.push(
          {
            title: 'getadmin.users.filters.partnerGroup',
            component: PartnerGroupChoice,
            onChange(chosen) {
              return {
                id: 'getadmin.users.filters.partnerGroup',
                value: chosen.label,
                data: chosen,
              };
            },
          },
          {
            title: 'getadmin.users.filters.partners',
            component: MultiCustomerPartnerFilter,
            onChange(chosenValue) {
              return {
                id: 'getadmin.users.filters.partners',
                value: chosenValue ? chosenValue.label : '',
                data: chosenValue,
              };
            },
          }
        );
      } else if (this.userIsGroupAccount) {
        currentVisibleFilters.push({
          title: 'getadmin.users.filters.partners',
          component: MultiCustomerPartnerFilter,
          onChange(chosenValue) {
            return {
              id: 'getadmin.users.filters.partners',
              value: chosenValue ? chosenValue.label : '',
              data: chosenValue,
            };
          },
        });
      }

      currentVisibleFilters.push({
        title: 'filters.offers',
        component: OfferFilter,
        onChange(chosenValue) {
          return {
            id: 'filters.offers',
            value: chosenValue ? chosenValue.label : '',
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
        currentVisibleFilters.push(
          {
            title: 'getadmin.users.filters.partnerGroup',
            component: PartnerGroupChoice,
            onChange(chosen) {
              return {
                id: 'getadmin.users.filters.partnerGroup',
                value: chosen.label,
                data: chosen,
              };
            },
          },
          {
            title: 'getadmin.users.filters.partners',
            component: MultiCustomerPartnerFilter,
            onChange(chosenValue) {
              return {
                id: 'getadmin.users.filters.partners',
                value: chosenValue ? chosenValue.label : '',
                data: chosenValue,
              };
            },
          }
        );
      } else if (this.userIsGroupAccount) {
        currentVisibleFilters.push({
          title: 'getadmin.users.filters.partners',
          component: MultiCustomerPartnerFilter,
          onChange(chosenValue) {
            return {
              id: 'getadmin.users.filters.partners',
              value: chosenValue ? chosenValue.label : '',
              data: chosenValue,
            };
          },
        });
      }

      currentVisibleFilters.push({
        title: 'filters.offers',
        component: OfferFilter,
        onChange(chosenValue) {
          return {
            id: 'filters.offers',
            value: chosenValue ? chosenValue.label : '',
            data: chosenValue,
          };
        },
        checkVisibleFn(currentFilters) {
          return currentFilters.find(f => f.id === 'getadmin.users.filters.partners');
        },
      });

      currentVisibleFilters.push({
        title: 'filters.zone',
        component: LocalisationFilter,
        onChange(chosenValue) {
          const zone = chosenValue.zone.world ? 'Monde' : 'France';
          const country = chosenValue.country ? chosenValue.country.label : undefined;
          const zipCode = chosenValue.zipCode ? chosenValue.zipCode : undefined;

          const labels = [{ id: zone, label: `Zone: ${zone}` }];
          if (country) labels.push({ id: country, label: `Pays: ${country}` });
          if (zipCode) labels.push({ id: zipCode, label: `Code postale: ${zipCode}` });
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
      this.cockpitMarkerToDetail = payload;
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
