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
      this.$router
        .push({
          name: 'actHistory.classic',
          params: {
            queryFilters: [...indicator.filters, ...this.contextFilters],
          },
        })
        .catch(() => {});
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
    const specificFilters = [
      {
        id: 'filters.category',
        value: 'STANDARD',
        hidden: true,
      },
      {
        id: 'filters.actTypes',
        values: [
          {
            id: 'RESILIATION',
            label: this.$t('getparc.actLines.commercialStatuses.demandeDeResiliation'),
          },
        ],
      },
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
        fetchKey: 'ACT_TERMINATION_IN_PROGRESS_6',

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
