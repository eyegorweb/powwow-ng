<template>
  <ul v-if="indicators" class="list-group bg-white mb-3">
    <li v-for="indicator in indicators" :key="indicator.labelKey" class="list-group-item">
      {{ $t(indicator.labelKey, indicator.tradArgs) }}

      <div class="float-right">
        <button
          :class="`btn btn-link p-0`"
          @click.prevent="onClick ? onClick(indicator) : () => {}"
        >
          <span>{{ indicator.value }}</span>
        </button>
      </div>
    </li>
  </ul>
</template>

<script>
import moment from 'moment';
import { formattedCurrentDate, DATE_FORMAT } from '@/utils/date';
import { fetchAlarmInstancesIndicators } from '@/api/alarms';
import { mapState } from 'vuex';

const startOfCurrentMonth = moment().startOf('month');
const startOfPrevCurrentMonth = moment()
  .subtract(1, 'month')
  .startOf('month');
const endOfPrevCurrentMonth = moment()
  .subtract(1, 'month')
  .endOf('month');
const startOfPenultimateMonth = moment()
  .subtract(2, 'month')
  .startOf('month');
const endOfPenultimateMonth = moment()
  .subtract(2, 'month')
  .endOf('month');

export default {
  data() {
    return {
      indicators: undefined,
    };
  },
  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
  },
  mounted() {
    this.refreshIndicators();
  },
  methods: {
    async refreshIndicators() {
      let partnerIds = undefined;
      if (this.contextPartners) {
        partnerIds = this.contextPartners.map(p => p.id);
      }

      const response = await fetchAlarmInstancesIndicators(
        ['ALARM_TRIGGERED_MONTH'],
        3,
        partnerIds,
        this.contextPartnersType
      );

      if (response && response.length) {
        const history = response[0].histories;
        const currentMonth = history[0].numberValue;
        const monthMinus1 = history[1].numberValue;
        const monthMinus2 = history[2].numberValue;

        this.indicators = [
          {
            labelKey: 'getvsion.indicators.triggered_current_month_ongoing',
            value: currentMonth,
            filters: [
              {
                id: 'getvsion.filters.DATE_TRIGGER',
                startDate: startOfCurrentMonth.format(DATE_FORMAT),
                endDate: formattedCurrentDate(),
              },
            ],
          },
          {
            labelKey: 'getvsion.indicators.triggered_last_month',
            value: monthMinus1,
            filters: [
              {
                id: 'getvsion.filters.DATE_TRIGGER',
                startDate: startOfPrevCurrentMonth.format(DATE_FORMAT),
                endDate: endOfPrevCurrentMonth.format(DATE_FORMAT),
              },
            ],
          },
          {
            labelKey: 'getvsion.indicators.triggered_before_last_month',
            tradArgs: {
              month: startOfPenultimateMonth.format('MMMM'),
            },
            value: monthMinus2,
            filters: [
              {
                id: 'getvsion.filters.DATE_TRIGGER',
                startDate: startOfPenultimateMonth.format(DATE_FORMAT),
                endDate: endOfPenultimateMonth.format(DATE_FORMAT),
              },
            ],
          },
        ];
      }
    },
    onClick(indicator) {
      this.setCurrentFiltersForIndicator(indicator);
    },

    setCurrentFiltersForIndicator(indicator) {
      this.$emit('apply', [...indicator.filters]);
    },
  },
};
</script>

<style lang="scss" scoped></style>
