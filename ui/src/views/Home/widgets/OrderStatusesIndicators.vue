<template>
  <Indicators
    v-if="indicators"
    :key="indicatorsVersion"
    :meta="indicators"
    :on-click="(indicator) => $emit('click', indicator)"
    :no-borders="noBorders"
    :small="small"
    precalculated
  />
</template>

<script>
import Indicators from '@/components/Indicators';
import moment from 'moment';

import { mapState, mapGetters, mapMutations } from 'vuex';
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
    ...mapState('getsim', ['defaultAppliedFilters', 'indicatorsVersion']),
    ...mapGetters('userContext', ['contextFilters']),
    ...mapGetters(['userIsPartner']),
  },
  watch: {
    contextFilters() {
      this.refreshIndicators();
    },
  },
  methods: {
    ...mapMutations('getsim', ['refreshIndicators']),
    refreshIndicators() {
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
        },
        {
          name: 'averageProcessingTime',
          labelKey: 'indicators.getsim.averageProcessingTime',
          clickable: false,
          total: '-',
          filters: [],
          fetchKey: 'ORDER_DELAY',
          getValueWithUnit(value) {
            if (isNaN(value)) return;
            return fromHoursToDDHH(value);
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

                hideZeroValue: true,
              },
            ],
            fetchKey: 'ORDER_NOT_CONFIRMED',

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

            hideZeroValue: true,
          }
        );
      }

      this.indicators = indicators;
    },
  },
  mounted() {
    this.refreshIndicators();
  },
  data() {
    return {
      indicators: undefined,
    };
  },
};
</script>

<style lang="scss" scoped></style>
