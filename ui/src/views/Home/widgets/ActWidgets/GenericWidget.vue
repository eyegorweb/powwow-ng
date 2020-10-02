<template>
  <WidgetBloc :widget="widget" no-padding>
    <Indicators
      :key="widgetVersion"
      v-if="indicators"
      :meta="indicators"
      :on-click="onCounterClick"
      no-borders
      small
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
        name: 'actHistory',
        params: {
          queryFilters: [...indicator.filters, ...this.contextFilters],
        },
      });
    },
  },

  computed: {
    ...mapGetters(['userIsMVNO']),

  },

  watch: {
    contextFilters() {
      this.widgetVersion += 1;
    },
  },

  mounted() {
    this.indicators = [
      {
        labelKey: 'indicators.getsim.actionsInProgress',
        color: 'text-danger',
        clickable: true,
        total: '-',
        filters: [
          ...this.specificFilters,
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
            startDate: formattedCurrentDate(),
            endDate: currentDateMinusMounts(6),
          },
        ],
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
          ...this.specificFilters,
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
            endDate: currentDateMinusDays(2),
          },
        ],
        fetch: async (indicator, contextFilters) => {
          return await countTotalForMassAction([...indicator.filters, ...contextFilters]);
        },
      },
      {
        labelKey: 'indicators.getsim.actionsFailed',
        isVisibleFn: () => !this.userIsMVNO,
        color: 'text-danger',
        clickable: true,
        total: '-',
        filters: [
          ...this.specificFilters,
          {
            id: 'filters.actStatus',
            values: [
              {
                id: 'IN_ERROR',
                label: this.$t('getparc.actStatuses.IN_ERROR'),
              },
            ],
          },
        ],
        fetch: async (indicator, contextFilters) => {
          return await countTotalForMassAction([...indicator.filters, ...contextFilters]);
        },
      },
      {
        labelKey: 'indicators.getparc.lines.failedTwoDays',
        color: 'text-danger',
        clickable: true,
        total: '-',
        isVisibleFn: () => !this.userIsMVNO,
        filters: [
          ...this.specificFilters,
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
            endDate: currentDateMinusDays(2),
          },
        ],
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
          ...this.specificFilters,
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
