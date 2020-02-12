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
        name: 'actHistory',
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

  mounted() {
    const specificFilters = [
      {
        id: 'filters.actTypes',
        values: [{ id: 'STATUS_CHANGE', label: this.$t('getparc.actTypes.STATUS_CHANGE') }],
      },
      // {
      //   id: 'filters.transitionName',
      //   value: 'valider',
      // },
    ];
    this.indicators = [
      {
        labelKey: 'indicators.getsim.actionsInProgress',
        color: 'text-danger',
        clickable: true,
        total: '-',
        filters: [
          ...specificFilters,
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
        fetchKey: 'ACT_TERMINATION_IN_PROGRESS',
        fetch: async (indicator, contextFilters) => {
          return await countTotalForMassAction([...indicator.filters, ...contextFilters]);
        },
      },
      {
        labelKey: 'indicators.getparc.lines.inprogressTwoDays',
        color: 'text-danger',
        clickable: true,
        total: '-',
        filters: [
          ...specificFilters,
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
        fetchKey: 'ACT_TERMINATION_IN_PROGRESS_48',

        fetch: async (indicator, contextFilters) => {
          return await countTotalForMassAction([...indicator.filters, ...contextFilters]);
        },
      },
      {
        labelKey: 'indicators.getsim.actionsFailed',
        color: 'text-danger',
        clickable: true,
        total: '-',
        filters: [
          ...specificFilters,
          {
            id: 'filters.actStatus',
            values: [
              {
                id: 'IN_ERROR',
                label: this.$t('getparc.actStatuses.IN_ERROR'),
              },
            ],
          },
          {
            id: 'filters.actDateStart',
            label: this.$t('filters.actDateStart'),
            startDate: currentDateMinusMounts(6),
          },
        ],
        fetchKey: 'ACT_TERMINATION_FAILED',
        fetch: async (indicator, contextFilters) => {
          return await countTotalForMassAction([...indicator.filters, ...contextFilters]);
        },
      },
      {
        labelKey: 'indicators.getparc.lines.failedTwoDays',
        color: 'text-danger',
        clickable: true,
        total: '-',
        filters: [
          ...specificFilters,
          {
            id: 'filters.actStatus',
            values: [
              {
                id: 'IN_ERROR',
                label: this.$t('getparc.actStatuses.IN_ERROR'),
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
        fetchKey: 'ACT_TERMINATION_FAILED_48',
        fetch: async (indicator, contextFilters) => {
          return await countTotalForMassAction([...indicator.filters, ...contextFilters]);
        },
      },
      {
        labelKey: 'indicators.getsim.actionsPlanned',
        color: 'text-danger',
        clickable: true,
        total: '-',
        filters: [
          ...specificFilters,
          {
            id: 'filters.actStatus',
            values: [
              {
                id: 'WAITING',
                label: this.$t('getparc.actLines.massActionsHistory.statuses.WAITING'),
              },
            ],
          },
          {
            id: 'filters.actDateStart',
            label: this.$t('filters.actDateStart'),
            startDate: formattedCurrentDate(),
          },
        ],
        fetchKey: 'ACT_TERMINATION_SCHEDULED',

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
