<template>
  <Indicators
    :key="indicatorsVersion"
    :meta="indicators"
    :on-click="indicator => $emit('click', indicator)"
    :no-borders="noBorders"
    :small="small"
  />
</template>

<script>
import Indicators from '@/components/Indicators';
import { fetchSingleIndicator } from '@/api/orders';
import { fetchAverageProcessingTime } from '@/api/indicators';
import moment from 'moment';

import { mapState, mapGetters, mapMutations } from 'vuex';

const dateFormat = 'DD-MM-YYYY';

export default {
  components: {
    Indicators,
  },
  props: {
    noBorders: Boolean,
    small: Boolean,
  },
  computed: {
    ...mapState('getsim', ['defaultAppliedFilters', 'indicatorsVersion']),
    ...mapGetters('userContext', ['contextFilters']),
  },
  watch: {
    contextFilters() {
      this.refreshIndicators();
    },
  },
  methods: {
    ...mapMutations('getsim', ['refreshIndicators']),
  },
  data() {
    return {
      indicators: [
        {
          name: 'toBeConfirmed',
          labelKey: 'indicators.getsim.ordersToBeConfirmed',
          color: 'text-danger',
          clickable: true,
          total: '-',
          filters: [
            {
              id: 'filters.orderStatus',
              values: [{ id: 'NOT_VALIDATED', label: this.$t('col.statuses.NOT_VALIDATED') }],
            },
            {
              id: 'filters.orderDate',
              startDate: moment()
                .subtract(6, 'month')
                .format(dateFormat),
              endDate: moment().format(dateFormat),
            },
          ],
          fetch: async (indicator, contextFilters) => {
            return await fetchSingleIndicator(indicator.filters, contextFilters);
          },
        },
        {
          name: 'ordersInProgress',
          labelKey: 'indicators.getsim.ordersInProgress',
          color: 'text-success',
          clickable: true,
          total: '-',
          filters: [
            {
              id: 'filters.orderStatus',
              values: [
                { id: 'TO_BE_CONFIRMED', label: this.$t('col.statuses.TO_BE_CONFIRMED') },
                {
                  id: 'TO_BE_CONFIRMED_BY_BO',
                  label: this.$t('col.statuses.TO_BE_CONFIRMED_BY_BO'),
                },
                {
                  id: 'CONFIRMATION_IN_PROGRESS',
                  label: this.$t('col.statuses.CONFIRMATION_IN_PROGRESS'),
                },
                { id: 'CONFIRMED', label: this.$t('col.statuses.CONFIRMED') },
              ],
            },
            {
              id: 'filters.orderDate',
              startDate: moment()
                .subtract(6, 'month')
                .format(dateFormat),
              endDate: moment().format(dateFormat),
            },
          ],
          fetch: async (indicator, contextFilters) => {
            return await fetchSingleIndicator(indicator.filters, contextFilters);
          },
        },
        {
          name: 'ordersNotConfirmed',
          labelKey: 'indicators.getsim.ordersNotConfirmed',
          color: 'text-warning',
          clickable: true,
          total: '-',
          filters: [
            {
              id: 'filters.orderStatus',
              values: [
                {
                  id: 'TO_BE_CONFIRMED',
                  label: this.$t('col.statuses.TO_BE_CONFIRMED'),
                },
                {
                  id: 'TO_BE_CONFIRMED_BY_BO',
                  label: this.$t('col.statuses.TO_BE_CONFIRMED_BY_BO'),
                },
                {
                  id: 'CONFIRMATION_IN_PROGRESS',
                  label: this.$t('col.statuses.CONFIRMATION_IN_PROGRESS'),
                },
              ],
            },
            {
              id: 'filters.orderDate',
              startDate: moment()
                .subtract(4, 'hours')
                .format('DD-MM-YYYY HH:mm:ss'),
              endDate: moment().format('DD-MM-YYYY HH:mm:ss'),
              sameDay: true,
            },
          ],
          fetch: async (indicator, contextFilters) => {
            return await fetchSingleIndicator(indicator.filters, contextFilters);
          },
          hideZeroValue: true,
        },
        {
          name: 'ordersFailed',
          labelKey: 'indicators.getsim.ordersFailed',
          color: 'text-warning',
          clickable: true,
          total: '-',
          filters: [
            {
              id: 'filters.orderStatus',
              values: [{ id: 'CONFIRMED', label: this.$t('col.statuses.CONFIRMED') }],
            },
            {
              id: 'filters.orderDate',
              startDate: moment()
                .subtract(6, 'month')
                .format(dateFormat),
              endDate: moment()
                .subtract(48, 'hours')
                .format('DD-MM-YYYY HH:mm:ss'),
            },
          ],
          fetch: async (indicator, contextFilters) => {
            return await fetchSingleIndicator(indicator.filters, contextFilters);
          },
          hideZeroValue: true,
        },
        {
          name: 'orderToBeConfirmedByBO',
          labelKey: 'indicators.getsim.orderToBeConfirmedByBO',
          color: 'text-danger',
          clickable: true,
          total: '-',
          roles: ['BO'],
          filters: [
            {
              id: 'filters.orderStatus',
              values: [
                {
                  id: 'TO_BE_CONFIRMED_BY_BO',
                  label: this.$t('col.statuses.TO_BE_CONFIRMED_BY_BO'),
                },
              ],
            },
          ],
          fetch: async (indicator, contextFilters) => {
            return await fetchSingleIndicator(indicator.filters, contextFilters);
          },
          hideZeroValue: true,
        },

        {
          name: 'averageProcessingTime',
          labelKey: 'indicators.getsim.averageProcessingTime',
          clickable: false,
          total: '-',
          filters: [],
          fetch: async (indicator, contextFilters) => {
            const total = await fetchAverageProcessingTime(contextFilters);
            let color = '';
            if (total < 5) {
              color = 'text-success';
            } else if (total >= 5) {
              color = 'text-warning';
            }
            return { total, color };
          },
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
