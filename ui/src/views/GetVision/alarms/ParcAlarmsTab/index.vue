<template>
  <div class="row">
    <div class="col-md-3 pl-0">
      <IndicatorsBlock />
      <FilterBar />
    </div>
    <div class="col-md-9">
      <AlarmsPerDayGraph :partners="selectedPartnerIds" />
      <AlarmsTable />
    </div>
  </div>
</template>

<script>
import IndicatorsBlock from './IndicatorsBlock';
import FilterBar from './FilterBar';
import AlarmsPerDayGraph from './AlarmsPerDayGraph';
import AlarmsTable from './AlarmsTable';
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  components: {
    IndicatorsBlock,
    FilterBar,
    AlarmsPerDayGraph,
    AlarmsTable,
  },

  mounted() {
    this.initFilterForContext();
  },

  methods: {
    ...mapActions('alarms', ['initFilterForContext']),
  },

  computed: {
    ...mapGetters('alarms', ['appliedFilters']),
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),

    selectedPartnerIds() {
      if (this.appliedFilters && this.appliedFilters.length) {
        const partnersFilterValues = this.appliedFilters.find(a => a.id === 'filters.partners');

        if (partnersFilterValues && partnersFilterValues.values) {
          return partnersFilterValues.values.map(p => p.id);
        }
      }

      return [];
    },
  },

  watch: {
    contextPartnersType() {
      this.initFilterForContext();
    },
    contextPartners() {
      this.initFilterForContext();
    },
  },
};
</script>

<style lang="scss" scoped></style>
