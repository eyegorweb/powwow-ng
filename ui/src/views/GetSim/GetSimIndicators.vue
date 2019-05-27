<template>
  <ul class="list-group bg-white">
    <li class="list-group-item">
      {{ $t('indicators.getsim.ordersToBeConfirmed') }}
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
      {{ $t('indicators.getsim.ordersInProgress') }}
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
      v-if="!userIsPartner && filteredStatus.ordersNotConfirmed.total > 0"
    >
      {{ $t('indicators.getsim.ordersNotConfirmed') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-warning"
          @click.prevent="filterByStatusIndicator(filteredStatus.ordersNotConfirmed)"
        >
          {{ filteredStatus.ordersNotConfirmed.total }}
        </button>
      </div>
    </li>
    <li class="list-group-item" v-if="!userIsPartner && filteredStatus.ordersFailed.total > 0">
      {{ $t('indicators.getsim.ordersFailed') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-warning"
          @click.prevent="filterByStatusIndicator(filteredStatus.ordersFailed)"
        >
          {{ filteredStatus.ordersFailed.total }}
        </button>
      </div>
    </li>
    <li
      class="list-group-item"
      v-if="!userIsPartner && filteredStatus.orderToBeConfirmedByBO.total > 0"
    >
      {{ $t('indicators.getsim.orderToBeConfirmedByBO') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-danger"
          @click.prevent="filterByStatusIndicator(filteredStatus.orderToBeConfirmedByBO)"
        >
          {{ filteredStatus.orderToBeConfirmedByBO.total }}
        </button>
      </div>
    </li>
    <li class="list-group-item" v-if="!userIsPartner">
      {{ $t('indicators.getsim.averageProcessingTime') }}
      <div class="float-right" :class="checkAverageProcessingTimeClasses">
        <span class="p-0 text-warning">{{
          formatteAverageProcessingTime(indicators.averageProcessingTime)
        }}</span>
      </div>
    </li>
  </ul>
</template>

<script>
import { fetchIndicators, fetchAverageProcessingTime } from '@/api/indicators';
import { countTotalByIndicators } from '@/api/orders';
import { mapMutations, mapGetters, mapState } from 'vuex';

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
    this.initComponent();
  },

  methods: {
    ...mapMutations('getsim', ['setCurrentFilters', 'applyFilters']),
    async initComponent() {
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

      // Pour les utilisateurs de type partenaire, il faudra chercher le partner de l'utilisateur dans le filtre par défaut ( initialisé au démarrage de la page)
      if (this.defaultAppliedFilters && this.defaultAppliedFilters.length) {
        contextPartnersFilter = this.defaultAppliedFilters;
      }

      const filterIndicatorToBeConfirmed = [
        {
          id: 'filters.orderStatus',
          values: this.filteredStatus.toBeConfirmed.status,
        },
        {
          id: 'filters.orderDate',
          startDate: this.filteredStatus.toBeConfirmed.date.range.start,
          endDate: this.filteredStatus.toBeConfirmed.date.range.end,
        },
        { ...contextPartnersFilter },
        { ...contextPartnerTypesFilter },
      ];
      const filterIndicatorOrdersInProgress = [
        {
          id: 'filters.orderStatus',
          values: this.filteredStatus.ordersInProgress.status,
        },
        {
          id: 'filters.orderDate',
          startDate: this.filteredStatus.ordersInProgress.date.range.start,
          endDate: this.filteredStatus.ordersInProgress.date.range.end,
        },
        { ...contextPartnersFilter },
        { ...contextPartnerTypesFilter },
      ];

      const filterIndicatorOrdersNotConfirmed = [
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
        { ...contextPartnersFilter },
        { ...contextPartnerTypesFilter },
      ];

      const filterIndicatorOrdersFailed = [
        {
          id: 'filters.orderStatus',
          values: this.filteredStatus.ordersFailed.status,
        },
        {
          id: 'filters.orderDate',
          startDate: this.filteredStatus.ordersFailed.date.range.start,
          endDate: this.filteredStatus.ordersFailed.date.range.end,
        },
        { ...contextPartnersFilter },
        { ...contextPartnerTypesFilter },
      ];

      const filterIndicatorOrderToBeConfirmedByBO = [
        {
          id: 'filters.orderStatus',
          values: this.filteredStatus.orderToBeConfirmedByBO.status,
        },
        { ...contextPartnersFilter },
        { ...contextPartnerTypesFilter },
      ];

      const result = await countTotalByIndicators(
        filterIndicatorToBeConfirmed,
        filterIndicatorOrdersInProgress,
        filterIndicatorOrdersNotConfirmed,
        filterIndicatorOrdersFailed,
        filterIndicatorOrderToBeConfirmedByBO
      );

      const filterTAverageProcessingTime = [
        { ...contextPartnersFilter },
        { ...contextPartnerTypesFilter },
      ];
      const averageProcessingTime = await fetchAverageProcessingTime(filterTAverageProcessingTime);

      this.indicators.averageProcessingTime = averageProcessingTime;
      this.filteredStatus.toBeConfirmed.total = result.indicatorToBeConfirmed.total;
      this.filteredStatus.ordersInProgress.total = result.indicatorOrdersInProgress.total;
      this.filteredStatus.ordersNotConfirmed.total = result.indicatorOrdersNotConfirmed.total;
      this.filteredStatus.ordersFailed.total = result.indicatorOrdersFailed.total;
      this.filteredStatus.orderToBeConfirmedByBO.total =
        result.indicatorOrderToBeConfirmedByBO.total;
    },
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
    formatteAverageProcessingTime(timeValue) {
      const dayMin = 24 * 60;
      const hourMin = 60;
      const unit = !timeValue ? '' : 'min';
      const formattedDuration = moment.duration({ minutes: timeValue });
      if (timeValue > dayMin) {
        timeValue = `${formattedDuration._data.days} j`;
      } else if (timeValue < dayMin && timeValue > hourMin) {
        timeValue = `${formattedDuration._data.hours} h`;
      } else {
        timeValue = `${formattedDuration._data.minutes} ${unit}`;
      }
      return timeValue;
    },
  },

  computed: {
    ...mapGetters(['userIsPartner']),
    ...mapState('getsim', ['defaultAppliedFilters']),
    ...mapState('userContext', ['contextPartnersTypes', 'contextPartners']),

    checkAverageProcessingTimeClasses() {
      return {
        'text-success': this.indicators.averageProcessingTime < 5,
        'text-warning': this.indicators.averageProcessingTime >= 5,
      };
    },
  },
  watch: {
    async contextPartners() {
      this.initComponent();
    },
    async contextPartnersTypes() {
      this.initComponent();
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
