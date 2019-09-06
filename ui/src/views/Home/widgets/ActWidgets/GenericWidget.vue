<template>
  <WidgetBloc :widget="widget" no-padding>
    <Indicators v-if="indicators" :meta="indicators" no-borders small />
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
  },

  mounted() {
    this.indicators = [
      {
        labelKey: 'indicators.getsim.actionsInProgress',
        color: 'text-danger',
        clickable: false,
        total: '-',
        filters: [
          ...this.specificFilters,
          {
            id: 'filters.actStatus',
            values: [
              {
                id: 'IN_PROGRESS',
              },
              {
                id: 'WAITING',
              },
            ],
          },
          {
            id: 'filters.actDateStart',
            startDate: formattedCurrentDate(),
            endDate: currentDateMinusMounts(6),
          },
        ],
        fetch: async (indicator, partners) => {
          return await countTotalForMassAction(indicator.filters, partners);
        },
      },
      {
        labelKey: 'indicators.getparc.lines.inprogressTwoDays',
        color: 'text-danger',
        clickable: false,
        total: '-',
        filters: [
          ...this.specificFilters,
          {
            id: 'filters.actStatus',
            values: [
              {
                id: 'IN_PROGRESS',
              },
              {
                id: 'WAITING',
              },
            ],
          },
          {
            id: 'filters.actDateStart',
            endDate: currentDateMinusDays(2),
          },
        ],
        fetch: async (indicator, partners) => {
          return await countTotalForMassAction(indicator.filters, partners);
        },
      },
      {
        labelKey: 'indicators.getsim.actionsFailed',
        color: 'text-danger',
        clickable: false,
        total: '-',
        filters: [
          ...this.specificFilters,
          {
            id: 'filters.actStatus',
            values: [
              {
                id: 'IN_ERROR',
              },
            ],
          },
        ],
        fetch: async (indicator, partners) => {
          return await countTotalForMassAction(indicator.filters, partners);
        },
      },
      {
        labelKey: 'indicators.getparc.lines.failedTwoDays',
        color: 'text-danger',
        clickable: false,
        total: '-',
        filters: [
          ...this.specificFilters,
          {
            id: 'filters.actStatus',
            values: [
              {
                id: 'IN_ERROR',
              },
            ],
          },
          {
            id: 'filters.actDateStart',
            endDate: currentDateMinusDays(2),
          },
        ],
        fetch: async (indicator, partners) => {
          return await countTotalForMassAction(indicator.filters, partners);
        },
      },
      {
        labelKey: 'indicators.getsim.actionsPlanned',
        color: 'text-danger',
        clickable: false,
        total: '-',
        filters: [
          ...this.specificFilters,
          {
            id: 'filters.actStatus',
            values: [
              {
                id: 'WAITING',
              },
            ],
          },
          {
            id: 'filters.actDateStart',
            startDate: formattedCurrentDate(),
          },
        ],
        fetch: async (indicator, partners) => {
          return await countTotalForMassAction(indicator.filters, partners);
        },
      },
    ];
  },

  data() {
    return {
      indicators: undefined,
    };
  },
};
</script>

<style lang="scss" scoped></style>
