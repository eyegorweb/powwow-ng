<template>
  <Indicators
    v-if="indicators"
    :meta="indicators"
    :applied-filters-value="appliedFiltersValue"
    :on-click="(indicator) => $emit('click', indicator)"
    :no-borders="noBorders"
    :small="small"
    precalculated
  />
</template>

<script>
import Indicators from '@/components/Indicators';
import { fetchSingleIndicator } from '@/api/orders';
import moment from 'moment';

import { mapGetters } from 'vuex';
import { fromHoursToDDHH } from '@/api/utils';

const dateFormat = 'DD/MM/YYYY';

export default {
  components: {
    Indicators,
  },
  props: {
    noBorders: Boolean,
    small: Boolean,
  },
  computed: {
    ...mapGetters('userContext', ['contextFilters']),
    ...mapGetters(['userIsPartner']),
    ...mapGetters('getsim', ['appliedFilters']),
    appliedFiltersValue() {
      let partners = [];
      let partnersFilter = this.appliedFilters.find((e) => e.id === 'filters.partners');
      if (partnersFilter) {
        partners = partnersFilter.values.map((p) => p.id);
      }
      return partners;
    },
  },
  methods: {
    fetchIndicators() {
      let indicators = [
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
          fetchKey: 'ORDER_TO_VALIDATE',
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
                { id: 'VALIDATED', label: this.$t('col.statuses.VALIDATED') },
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
          fetchKey: 'ORDER_IN_PROCESS',
          fetch: async (indicator, contextFilters) => {
            return await fetchSingleIndicator(indicator.filters, contextFilters);
          },
        },
      ];

      if (!this.userIsPartner) {
        indicators.push(
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
                  {
                    id: 'VALIDATED',
                    label: this.$t('col.statuses.VALIDATED'),
                  },
                ],
              },
              {
                id: 'filters.orderDate',
                startDate: moment()
                  .subtract(12, 'month')
                  .subtract(4, 'hours')
                  .format('DD/MM/YYYY HH:mm:ss'),
                endDate: moment()
                  .subtract(4, 'hours')
                  .format('DD/MM/YYYY HH:mm:ss'),
                sameDay: true,
              },
            ],
            fetchKey: 'ORDER_NOT_CONFIRMED',
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
                  .subtract(12, 'month')
                  .subtract(48, 'hours')
                  .format('DD/MM/YYYY HH:mm:ss'),
                endDate: moment()
                  .subtract(48, 'hours')
                  .format('DD/MM/YYYY HH:mm:ss'),
              },
            ],
            fetchKey: 'ORDER_FAILED',
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
            fetchKey: 'ORDER_TO_VALIDATE_BO',
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
            fetchKey: 'ORDER_DELAY',
            getValueWithUnit(value) {
              if (isNaN(value)) return '';
              return fromHoursToDDHH(value);
            },
          }
        );
      }
      this.indicators = indicators;
    },
  },
  mounted() {
    this.fetchIndicators();
  },
  data() {
    return {
      indicators: undefined,
    };
  },
};
</script>

<style lang="scss" scoped></style>
