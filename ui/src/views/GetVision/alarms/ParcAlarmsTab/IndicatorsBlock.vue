<template>
  <div class="mb-2">
    <Indicators :meta="indicators" :on-click="onClick" precalculated />
  </div>
</template>

<script>
import Indicators from '@/components/Indicators';
import moment from 'moment';
import { mapMutations } from 'vuex';
import { formattedCurrentDate, DATE_FORMAT } from '@/utils/date';

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
  components: {
    Indicators,
  },
  data() {
    return {
      indicators: [
        {
          name: 'triggered_current_month_ongoing',
          labelKey: 'getvsion.indicators.triggered_current_month_ongoing',
          color: '',
          clickable: true,
          total: '-',
          filters: [
            {
              id: 'getvsion.filters.DATE_TRIGGER',
              startDate: startOfCurrentMonth.format(DATE_FORMAT),
              endDate: formattedCurrentDate(),
            },
          ],
          fetchKey: 'ALARM_TRIGGERED_M0',
        },
        {
          name: 'triggered_last_month',
          labelKey: 'getvsion.indicators.triggered_last_month',
          color: '',
          clickable: true,
          total: '-',
          filters: [
            {
              id: 'getvsion.filters.DATE_TRIGGER',
              startDate: startOfPrevCurrentMonth.format(DATE_FORMAT),
              endDate: endOfPrevCurrentMonth.format(DATE_FORMAT),
            },
          ],
          fetchKey: 'ALARM_TRIGGERED_M1',
        },
        {
          name: 'triggered_before_last_month',
          labelKey: this.$t('getvsion.indicators.triggered_before_last_month', {
            month: startOfPenultimateMonth.format('MMMM'),
          }),
          color: '',
          clickable: true,
          total: '-',
          filters: [
            {
              id: 'getvsion.filters.DATE_TRIGGER',
              startDate: startOfPenultimateMonth.format(DATE_FORMAT),
              endDate: endOfPenultimateMonth.format(DATE_FORMAT),
            },
          ],
          fetchKey: 'ALARM_TRIGGERED_M2',
        },
      ],
    };
  },
  methods: {
    ...mapMutations('alarms', ['setCurrentFilters', 'applyFilters']),
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
