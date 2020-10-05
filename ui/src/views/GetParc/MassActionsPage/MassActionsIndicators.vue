<template>
  <div>
    <Indicators v-if="indicators" :meta="indicators" :on-click="onClick" precalculated />
  </div>
</template>

<script>
import Indicators from '@/components/Indicators';
import moment from 'moment';
import { fetchSingleIndicator } from '@/api/massActions';
import { currentDateMinusMounts } from '@/utils/date';

const dateFormat = 'DD/MM/YYYY';
import { mapMutations, mapState, mapGetters } from 'vuex';

export default {
  components: {
    Indicators,
  },
  data() {
    return {
      indicators: undefined,
    };
  },
  mounted() {
    this.indicators = [
      {
        name: 'actionsInProgress',
        labelKey: 'indicators.getsim.actionsInProgress',
        color: 'text-danger',
        clickable: true,
        total: '-',
        filters: [
          {
            id: 'filters.actStatus',
            values: [
              {
                id: 'IN_PROGRESS',
                label: this.$t('getparc.history.col.ongoing'),
              },
            ],
          },
          {
            id: 'filters.actDateStart',
            startDate: currentDateMinusMounts(6),
          },
        ],
        fetchKey: 'ACT_IN_PROGRESS',
        fetch: async (indicator, contextFilters) => {
          return await fetchSingleIndicator(indicator.filters, contextFilters);
        },
      },
      {
        name: 'actionsPlanned',
        labelKey: 'indicators.getsim.actionsPlanned',
        color: 'text-danger',
        clickable: true,
        total: '-',
        filters: [
          {
            id: 'filters.actDateStart',
            startDate: moment.min().format(dateFormat),
          },
        ],
        fetchKey: 'ACT_SCHEDULED',
        fetch: async (indicator, contextFilters) => {
          return await fetchSingleIndicator(indicator.filters, contextFilters);
        },
      },
    ];
  },
  computed: {
    ...mapState('getsim', ['defaultAppliedFilters']),
    ...mapGetters(['userIsMVNO']),
  },
  methods: {
    ...mapMutations('actHistory', ['setCurrentFilters', 'applyFilters']),

    onClick(indicator) {
      this.setCurrentFiltersForIndicator(indicator);
    },
    setCurrentFiltersForIndicator(indicator) {
      this.setCurrentFilters([...indicator.filters]);
      this.applyFilters();
    },
  },
};
</script>

<style lang="scss" scoped></style>
