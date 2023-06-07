<template>
  <WidgetBloc :widget="widget" no-padding>
    <Indicators
      :key="widgetVersion"
      v-if="indicators"
      :meta="indicators"
      :on-click="onCounterClick"
      no-borders
      small
      precalculated
    />
  </WidgetBloc>
</template>

<script>
import Indicators from '@/components/Indicators';
import WidgetBloc from '@/views/Home/widgets/WidgetBloc';

import { countTotalForMassAction } from '@/api/massActions';
import { currentDateMinusMounts, formattedCurrentDate, currentDateMinusDays } from '@/utils/date';
import { mapGetters } from 'vuex';

export default {
  components: {
    Indicators,
    WidgetBloc,
  },
  props: {
    widget: Object,
    specificFilters: {
      type: Array,
      default: () => [],
    },
    contextFilters: Array,
  },
  methods: {
    onCounterClick(indicator) {
      this.$router.push({
        name: 'actHistory.classic',
        params: {
          queryFilters: [...indicator.filters, ...this.contextFilters],
        },
      });
    },
  },

  watch: {
    contextFilters() {
      this.widgetVersion += 1;
    },
  },

  computed: {
    ...mapGetters(['userIsMVNO']),
  },

  mounted() {
    this.indicators = [
      {
        labelKey: 'indicators.getsim.actionsInProgress',
        color: 'text-success',
        clickable: true,
        total: '-',
        filters: [
          {
            id: 'filters.category',
            value: 'STANDARD',
            hidden: true,
          },
          {
            id: 'filters.actStatus',
            values: [
              {
                id: 'IN_PROGRESS',
                label: this.$t('getparc.history.col.ongoing'),
              },
              {
                id: 'WAITING',
                label: this.$t('getparc.actLines.massActionsHistory.statuses.WAITING'),
              },
            ],
          },
          {
            id: 'filters.actDateStart',
            label: this.$t('filters.actDateStart'),
            startDate: currentDateMinusMounts(6),
          },
        ],
        fetchKey: 'ACT_IN_PROGRESS',
        fetch: async (indicator, contextFilters) => {
          return await countTotalForMassAction([...indicator.filters, ...contextFilters]);
        },
      },
      {
        labelKey: 'indicators.getparc.lines.inprogressTwoDays',
        color: 'text-warning',
        clickable: true,
        total: '-',
        filters: [
          {
            id: 'filters.category',
            value: 'STANDARD',
            hidden: true,
          },
          {
            id: 'filters.actStatus',
            values: [
              {
                id: 'IN_PROGRESS',
                label: this.$t('getparc.history.col.ongoing'),
              },
              {
                id: 'WAITING',
                label: this.$t('getparc.actLines.massActionsHistory.statuses.WAITING'),
              },
            ],
          },
          {
            id: 'filters.actDateStart',
            label: this.$t('filters.actDateStart'),
            startDate: currentDateMinusMounts(6),
            endDate: currentDateMinusDays(2),
          },
        ],
        fetchKey: 'ACT_IN_PROGRESS_6',

        fetch: async (indicator, contextFilters) => {
          return await countTotalForMassAction([...indicator.filters, ...contextFilters]);
        },
      },
      {
        labelKey: 'indicators.getsim.failedActs',
        color: 'text-warning',
        clickable: true,
        total: '-',
        filters: [
          {
            id: 'filters.category',
            value: 'STANDARD',
            hidden: true,
          },
          {
            id: 'filters.actStatus',
            values: [
              {
                id: 'KO',
                label: this.$t('getparc.actLines.massActionsHistory.statuses.KO'),
              },
            ],
          },
          {
            id: 'filters.actDateStart',
            label: this.$t('filters.actDateStart'),
            startDate: formattedCurrentDate(),
          },
        ],
        fetchKey: 'ACT_FAILED',

        fetch: async (indicator, contextFilters) => {
          return await countTotalForMassAction([...indicator.filters, ...contextFilters]);
        },
      },
    ];
  },

  data() {
    return {
      indicators: undefined,
      widgetVersion: 1,
    };
  },
};
</script>

<style lang="scss" scoped></style>
