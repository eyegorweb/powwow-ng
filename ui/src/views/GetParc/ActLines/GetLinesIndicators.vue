<template>
  <ul class="list-group bg-white">
    <li class="list-group-item">
      {{ $t('indicators.getparc.lines.cancellation') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-danger"
          @click.prevent="filterByStatusIndicator(filteredStatus.toBeConfirmed)"
        >
          {{ filteredStatus.toBeConfirmed.total }}
        </button>
      </div>
    </li>
    <li class="list-group-item">
      {{ $t('indicators.getparc.lines.failed') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-success"
          @click.prevent="filterByStatusIndicator(filteredStatus.ordersInProgress)"
        >
          {{ filteredStatus.ordersInProgress.total }}
        </button>
      </div>
    </li>
    <li
      class="list-group-item"
      v-if="!userIsPartner && filteredStatus.ordersNotConfirmed.total >= 0"
    >
      {{ $t('indicators.getparc.lines.availableSIMCards') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-warning"
          @click.prevent="filterByStatusIndicator(filteredStatus.ordersNotConfirmed)"
        >
          {{ filteredStatus.ordersNotConfirmed.total }}
        </button>
      </div>
    </li>
    <li class="list-group-item" v-if="!userIsPartner && filteredStatus.ordersFailed.total >= 0">
      {{ $t('indicators.getparc.lines.allocatedSIMCards') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-warning"
          @click.prevent="filterByStatusIndicator(filteredStatus.ordersFailed)"
        >
          {{ filteredStatus.ordersFailed.total }}
        </button>
      </div>
    </li>
    <li class="list-group-item" v-if="!userIsPartner">
      {{ $t('indicators.getparc.lines.activatedSIMCards') }}
      <div class="float-right" :class="checkAverageProcessingTimeClasses">
        <span class="p-0 text-warning">{{ indicators.averageProcessingTime }}</span>
      </div>
    </li>
    <li
      class="list-group-item"
      v-if="!userIsPartner && filteredStatus.orderToBeConfirmedByBO.total >= 0"
    >
      {{ $t('indicators.getparc.lines.suspended') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-warning"
          @click.prevent="filterByStatusIndicator(filteredStatus.orderToBeConfirmedByBO)"
        >
          {{ filteredStatus.orderToBeConfirmedByBO.total }}
        </button>
      </div>
    </li>
    <li
      class="list-group-item"
      v-if="!userIsPartner && filteredStatus.orderToBeConfirmedByBO.total >= 0"
    >
      {{ $t('indicators.getparc.lines.traffic') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-warning"
          @click.prevent="filterByStatusIndicator(filteredStatus.orderToBeConfirmedByBO)"
        >
          {{ filteredStatus.orderToBeConfirmedByBO.total }}
        </button>
      </div>
    </li>
    <li
      class="list-group-item"
      v-if="!userIsPartner && filteredStatus.orderToBeConfirmedByBO.total >= 0"
    >
      {{ $t('indicators.getparc.lines.validation') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-warning"
          @click.prevent="filterByStatusIndicator(filteredStatus.orderToBeConfirmedByBO)"
        >
          {{ filteredStatus.orderToBeConfirmedByBO.total }}
        </button>
      </div>
    </li>
  </ul>
</template>

<script>
/**
 * DEPRECATED
 */
import { fetchIndicators } from '@/api/indicators';
import { countTotalByIndicators } from '@/api/orders';
import { mapMutations, mapGetters } from 'vuex';

import moment from 'moment';

const dateFormat = 'DD-MM-YYYY';

export default {
  data() {
    return {
      indicators: {},
      total: 0,
      filteredStatus: {
        toBeConfirmed: {
          total: 0,
          status: [{ id: 'NOT_VALIDATED', label: this.$t('col.statuses.NOT_VALIDATED') }],
          date: {
            range: {
              start: moment()
                .subtract(6, 'month')
                .format(dateFormat),
              end: moment().format(dateFormat),
            },
          },
        },
        ordersInProgress: {
          total: 0,
          status: [
            { id: 'TO_BE_CONFIRMED', label: this.$t('col.statuses.TO_BE_CONFIRMED') },
            { id: 'TO_BE_CONFIRMED_BY_BO', label: this.$t('col.statuses.TO_BE_CONFIRMED_BY_BO') },
            {
              id: 'CONFIRMATION_IN_PROGRESS',
              label: this.$t('col.statuses.CONFIRMATION_IN_PROGRESS'),
            },
            { id: 'CONFIRMED', label: this.$t('col.statuses.CONFIRMED') },
          ],
          date: {
            range: {
              start: moment()
                .subtract(6, 'month')
                .format(dateFormat),
              end: moment().format(dateFormat),
            },
          },
        },
        ordersNotConfirmed: {
          total: 0,
          status: [
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
          date: {
            range: {
              start: moment()
                .subtract(4, 'hours')
                .format('DD-MM-YYYY HH:mm:ss'),
              end: moment().format('DD-MM-YYYY HH:mm:ss'),
              sameDay: true,
            },
          },
        },
        ordersFailed: {
          total: 0,
          status: [{ id: 'CONFIRMED', label: this.$t('col.statuses.CONFIRMED') }],
          date: {
            range: {
              start: moment()
                .subtract(6, 'month')
                .format(dateFormat),
              end: moment()
                .subtract(48, 'hours')
                .format('DD-MM-YYYY HH:mm:ss'),
            },
          },
        },
        orderToBeConfirmedByBO: {
          total: 0,
          status: [
            {
              id: 'TO_BE_CONFIRMED_BY_BO',
              label: this.$t('col.statuses.TO_BE_CONFIRMED_BY_BO'),
            },
          ],
        },
      },
    };
  },

  async mounted() {
    this.indicators = (await fetchIndicators()) || {};

    const result = await countTotalByIndicators(
      [
        {
          id: 'filters.orderStatus',
          values: this.filteredStatus.toBeConfirmed.status,
        },
        {
          id: 'filters.orderDate',
          startDate: this.filteredStatus.toBeConfirmed.date.range.start,
          endDate: this.filteredStatus.toBeConfirmed.date.range.end,
        },
      ],
      [
        {
          id: 'filters.orderStatus',
          values: this.filteredStatus.ordersInProgress.status,
        },
        {
          id: 'filters.orderDate',
          startDate: this.filteredStatus.ordersInProgress.date.range.start,
          endDate: this.filteredStatus.ordersInProgress.date.range.end,
        },
      ],
      [
        {
          id: 'filters.orderStatus',
          values: this.filteredStatus.ordersNotConfirmed.status,
        },
        {
          id: 'filters.orderDate',
          startDate: this.filteredStatus.ordersNotConfirmed.date.range.start,
          endDate: this.filteredStatus.ordersNotConfirmed.date.range.end,
          sameDay: this.filteredStatus.ordersNotConfirmed.date.range.sameDay,
        },
      ],
      [
        {
          id: 'filters.orderStatus',
          values: this.filteredStatus.ordersFailed.status,
        },
        {
          id: 'filters.orderDate',
          startDate: this.filteredStatus.ordersFailed.date.range.start,
          endDate: this.filteredStatus.ordersFailed.date.range.end,
        },
      ],
      [
        {
          id: 'filters.orderStatus',
          values: this.filteredStatus.ordersFailed.status,
        },
        {
          id: 'filters.orderDate',
          startDate: this.filteredStatus.ordersFailed.date.range.start,
          endDate: this.filteredStatus.ordersFailed.date.range.end,
        },
      ]
    );

    this.filteredStatus.toBeConfirmed.total = result.indicatorToBeConfirmed.total;
    this.filteredStatus.ordersInProgress.total = result.indicatorOrdersInProgress.total;
    this.filteredStatus.ordersNotConfirmed.total = result.indicatorOrdersNotConfirmed.total;
    this.filteredStatus.ordersFailed.total = result.indicatorOrdersFailed.total;
    this.filteredStatus.orderToBeConfirmedByBO.total = result.indicatorOrderToBeConfirmedByBO.total;
  },

  methods: {
    ...mapMutations('getsim', ['setCurrentFilters', 'applyFilters']),
    filterByStatusIndicator(preselectedFilter) {
      // TODO: filter this status (ordersNotConfirmed) with order.auditable.updated > 4h
      // TODO: filter this status (ordersFailed) with order.auditable.updated > 48h

      let dateFilter = {};

      if (preselectedFilter.date) {
        dateFilter = {
          id: 'filters.orderDate',
          startDate: preselectedFilter.date.range.start,
          endDate: preselectedFilter.date.range.end,
          sameDay: preselectedFilter.date.range.sameDay,
        };
      }

      this.setCurrentFilters([
        {
          id: 'filters.orderStatus',
          values: preselectedFilter.status,
        },
        {
          ...dateFilter,
        },
      ]);

      this.applyFilters();
    },
  },

  computed: {
    ...mapGetters(['userIsPartner']),

    checkAverageProcessingTimeClasses() {
      return {
        'text-success': this.indicators.averageProcessingTime < 5,
        'text-warning': this.indicators.averageProcessingTime >= 5,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.list-group {
  padding: 1.25rem 1rem;

  .list-group-item {
    border: none;
    padding: 0.75rem 0;
    border-bottom: 2px solid $medium-gray;

    &:last-child {
      border: none;
    }
  }
}
</style>
