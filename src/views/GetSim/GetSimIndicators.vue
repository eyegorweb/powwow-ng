<template>
  <ul class="list-group bg-white">
    <li class="list-group-item">
      {{ $t('indicators.ordersToBeConfirmed') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-danger"
          @click.prevent="filterByStatusIndicator(filteredStatus.toBeConfirmed)"
        >
          {{ indicators.ordersToBeConfirmed }}
        </button>
      </div>
    </li>
    <li class="list-group-item">
      {{ $t('indicators.ordersInProgress') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-success"
          @click.prevent="filterByStatusIndicator(filteredStatus.ordersInProgress)"
        >
          {{ indicators.ordersInProgress }}
        </button>
      </div>
    </li>
    <li class="list-group-item" v-if="!userIsPartner && indicators.ordersNotConfirmed >= 0">
      {{ $t('indicators.ordersNotConfirmed') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-warning"
          @click.prevent="filterByStatusIndicator(filteredStatus.ordersNotConfirmed)"
        >
          {{ indicators.ordersNotConfirmed }}
        </button>
      </div>
    </li>
    <li class="list-group-item" v-if="!userIsPartner && indicators.ordersFailed >= 0">
      {{ $t('indicators.ordersFailed') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-warning"
          @click.prevent="filterByStatusIndicator(filteredStatus.ordersFailed)"
        >
          {{ indicators.ordersFailed }}
        </button>
      </div>
    </li>
    <li class="list-group-item" v-if="!userIsPartner">
      {{ $t('indicators.averageProcessingTime') }}
      <div class="float-right" :class="checkAverageProcessingTimeClasses">
        <span class="p-0 text-warning">{{ indicators.averageProcessingTime }}</span>
      </div>
    </li>
    <li class="list-group-item" v-if="!userIsPartner && indicators.orderToBeConfirmedByBO >= 0">
      {{ $t('indicators.orderToBeConfirmedByBO') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-warning"
          @click.prevent="filterByStatusIndicator(filteredStatus.orderToBeConfirmedByBO)"
        >
          {{ indicators.orderToBeConfirmedByBO }}
        </button>
      </div>
    </li>
  </ul>
</template>

<script>
import { fetchGetSimIndicators } from '@/api/indicators';
import { mapMutations, mapGetters } from 'vuex';

import moment from 'moment';

const dateFormat = 'DD-MM-YYYY';

export default {
  data() {
    return {
      indicators: {},
      filteredStatus: {
        toBeConfirmed: {
          status: [{ id: 'NOT_VALIDATED', label: 'Non validée' }],
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

  async created() {
    this.indicators = (await fetchGetSimIndicators()) || {};
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
