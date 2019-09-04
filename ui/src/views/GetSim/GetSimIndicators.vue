<template>
  <Indicators
    :key="indicatorsVersion"
    :meta="indicators"
    :on-click="indicator => $emit('click', indicator)"
    :partners="partnersForIndicators"
    :no-borders="noBorders"
  />
</template>

<script>
import Indicators from '@/components/Indicators';
import { fetchSingleIndicator } from '@/api/orders';
import { fetchAverageProcessingTime } from '@/api/indicators';
import moment from 'moment';

import { mapState } from 'vuex';

const dateFormat = 'DD-MM-YYYY';

export default {
  components: {
    Indicators,
  },
  props: {
    noBorders: Boolean,
  },
  computed: {
    ...mapState('getsim', ['defaultAppliedFilters', 'indicatorsVersion']),
    partnersForIndicators() {
      if (this.defaultAppliedFilters && this.defaultAppliedFilters.length) {
        return this.defaultAppliedFilters.find(f => f.id === 'filters.partners');
      }

      return null;
    },
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
          fetch: async (indicator, partners) => {
            return await fetchSingleIndicator(indicator.filters, partners);
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
          fetch: async (indicator, partners) => {
            return await fetchSingleIndicator(indicator.filters, partners);
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
          fetch: async (indicator, partners) => {
            return await fetchSingleIndicator(indicator.filters, partners);
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
          fetch: async (indicator, partners) => {
            return await fetchSingleIndicator(indicator.filters, partners);
          },
          hideZeroValue: true,
        },
        {
          name: 'orderToBeConfirmedByBO',
          labelKey: 'indicators.getsim.orderToBeConfirmedByBO',
          color: 'text-danger',
          clickable: true,
          total: '-',
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
          fetch: async (indicator, partners) => {
            return await fetchSingleIndicator(indicator.filters, partners);
          },
          hideZeroValue: true,
        },

        {
          name: 'averageProcessingTime',
          labelKey: 'indicators.getsim.averageProcessingTime',
          clickable: false,
          total: '-',
          filters: [],
          fetch: async () => {
            let contextPartnersFilter = {};
            let contextPartnerTypesFilter = {};

            if (this.contextPartnersTypes && this.contextPartnersTypes.length) {
              contextPartnerTypesFilter = {
                id: 'filters.partnerTypes',
                values: this.contextPartnersTypes,
              };
            }
            if (this.contextPartners && this.contextPartners.length) {
              contextPartnersFilter = {
                id: 'filters.partners',
                values: this.contextPartners,
              };
            }

            if (this.defaultAppliedFilters && this.defaultAppliedFilters.length) {
              contextPartnersFilter = this.defaultAppliedFilters;
            }
            const filterTAverageProcessingTime = [
              { ...contextPartnersFilter },
              { ...contextPartnerTypesFilter },
            ];
            const total = await fetchAverageProcessingTime(filterTAverageProcessingTime);
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
