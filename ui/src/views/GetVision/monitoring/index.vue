<template>
  <div class="row mt-4 mb-4">
    <div class="col-3">
      <MonitoringIndicators :appliedFilters="appliedFilters" :usage="currentUsage" />
      <FilterBar
        v-if="filters"
        :filter-components="filters"
        @applyFilters="doSearch"
        @noMoreFilters="onAllFiltersCleared"
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
            <MapLegend />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FilterBar from '@/components/Filters/TableWithFilter/FilterBar.vue';
import BillsPartnerFilter from '@/views/GetReport/Bill/filters/BillsPartnerFilter.vue';
import OfferFilter from './filters/OfferFilter';
import TextFilter from '@/components/Filters/TextFilter.vue';
import Toggle from '@/components/ui/UiToggle2';
import FileFilter from './filters/FileFilter';
import PartnerGroupChoice from './filters/PartnerGroupChoice';
import LocalisationFilter from './filters/LocalisationFilter';
import MapLegend from './MapLegend';
import MonitoringIndicators from './MonitoringIndicators';
import cloneDeep from 'lodash.clonedeep';


import { mapGetters } from 'vuex';

export default {
  components: {
    FilterBar,
    LocalisationFilter,
    Toggle,
    MapLegend,
    MonitoringIndicators,
  },
  computed: {
    ...mapGetters(['userIsBO', 'userIsGroupAccount']),
  },
  data() {
    return {
      filters: undefined,
      toggleValues: undefined,
      currentUsage: undefined,
      appliedFilters: undefined
    };
  },

  mounted() {
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
              data: chosen
            };
          },
        },
        {
          title: 'getadmin.users.filters.partners',
          component: BillsPartnerFilter,
          onChange(chosenValue) {
            return {
              id: 'getadmin.users.filters.partners',
              value: chosenValue ? chosenValue.label : '',
              data: chosenValue,
            };
          },
        },
      );
    } else if (this.userIsGroupAccount) {
      currentVisibleFilters.push({
        title: 'getadmin.users.filters.partners',
        component: PartnerFilter,
        onChange(chosenValues) {
          return {
            id: 'getadmin.users.filters.partners',
            values: chosenValues,
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
      }
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

    this.filters = currentVisibleFilters;

    this.toggleValues = [
      {
        id: 'allUsages',
        label: 'getvsion.allUsages',
        default: this.value === 'allUsages',
      },
      {
        id: 'dataUsage',
        label: 'getvsion.dataUsage',
        default: this.value === 'dataUsage',
      },
      {
        id: 'm2mCockpit',
        label: 'getvsion.m2mCockpit',
        default: this.value === 'm2mCockpit',
      },
    ];
  },

  methods: {
    doSearch(appliedFilters) {
      this.appliedFilters = cloneDeep(appliedFilters);
    },
    onAllFiltersCleared() { },
  },
};
</script>

<style lang="scss" scoped></style>
