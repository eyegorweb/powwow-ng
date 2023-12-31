<template>
  <WidgetBloc :widget="widget" @seeMore="onSeeMore">
    <GenericTableWidget
      v-if="resultsPromise"
      :columns="columns"
      :rows="rows"
      :results-promise="resultsPromise"
      :order-by.sync="orderBy"
    />
  </WidgetBloc>
</template>

<script>
import { searchOrders } from '@/api/orders';
import GetSimOrdersStatusCell from '@/views/GetSim/GetSimOrders/GetSimOrdersStatusCell';
import { mapGetters } from 'vuex';
import WidgetBloc from './WidgetBloc';
import moment from 'moment';
import GenericTableWidget from './GenericTableWidget';
import { truncateLabel } from '@/utils';

export default {
  components: {
    WidgetBloc,
    GenericTableWidget,
  },
  props: {
    widget: Object,
    contextFilters: Array,
  },
  computed: {
    ...mapGetters(['userIsPartner', 'userIsM2MLight']),
    ...mapGetters('getsim', ['appliedFilters']),

    columns() {
      if (this.userIsPartner) {
        return this.allColumns.filter((c) => c.name !== 'party');
      }
      return this.allColumns;
    },

    widgetFilters() {
      return [...this.contextFilters, ...this.filters];
    },
  },
  methods: {
    onSeeMore() {
      if (this.userIsM2MLight) {
        this.$pushAnalytics({ event: 'm2m.seeMore', widget: 'Mes commandes - OD' });
      } else {
        this.$pushAnalytics({ event: 'm2m.seeMore', widget: 'Mes commandes' });
      }
      this.$router
        .push({
          name: 'orders.search',
          params: {
            queryFilters: [...this.widgetFilters],
          },
        })
        .catch(() => {});
    },
  },
  async mounted() {
    const pageInfo = { page: 0, limit: 3 };
    this.resultsPromise = searchOrders(this.orderBy, pageInfo, this.widgetFilters);
    const res = await this.resultsPromise;
    if (res.items) {
      this.rows = res.items;
    }
  },
  data() {
    return {
      orderBy: { key: 'creationDate', direction: 'DESC' },

      filters: [
        {
          id: 'filters.orderStatus',
          values: [
            { id: 'TO_BE_CONFIRMED', label: this.$t('col.statuses.TO_BE_CONFIRMED') },
            { id: 'TO_BE_CONFIRMED_BY_BO', label: this.$t('col.statuses.TO_BE_CONFIRMED_BY_BO') },
            {
              id: 'CONFIRMATION_IN_PROGRESS',
              label: this.$t('col.statuses.CONFIRMATION_IN_PROGRESS'),
            },
            { id: 'CONFIRMED', label: this.$t('col.statuses.CONFIRMED') },
            {
              id: 'WAITING_FOR_PAYMENT',
              label: this.$t('col.statuses.WAITING_FOR_PAYMENT'),
            },
          ],
        },
        {
          id: 'filters.orderDate',
          startDate: moment()
            .subtract(6, 'month')
            .format('DD/MM/YYYY'),
          endDate: moment().format('DD/MM/YYYY'),
        },
      ],
      resultsPromise: undefined,
      allColumns: [
        {
          id: 1,
          label: this.$t('col.id'),
          name: 'id',
          orderable: false,
          noHandle: true,
          visible: true,
          fixed: true,
          exportId: 'ORDER_ID',
          format: {
            type: 'LinkBtn',
            onClick: (orderId) => {
              this.$router
                .push({
                  name: 'orders.search',
                  params: {
                    openDetailPanel: true,
                    queryFilters: [{ id: 'filters.idOrder', value: orderId, hidden: false }],
                  },
                })
                .catch(() => {});
            },
            isClickable: () => true,
          },
        },
        {
          id: 2,
          label: this.$t('col.partner'),
          name: 'party',
          orderable: false,
          noHandle: true,
          sortingName: 'partyName',
          visible: true,
          exportId: 'ORDER_PARTY',

          tootltipText: (item, row) => {
            return row.party.name;
          },
          format: {
            type: 'Getter',
            getter: (row) => {
              return truncateLabel(row.party.name);
            },
          },
        },
        {
          id: 3,
          label: this.$t('col.product'),
          name: 'orderedSIMCard',
          orderable: false,
          noHandle: true,
          visible: true,
          sortingName: 'simcardDesc',
          exportId: 'ORDER_SIMCARD_TYPE',
          tootltipText: (item, row) => {
            return this.userIsPartner ? '' : row.orderedSIMCard.description;
          },
          format: {
            type: 'Getter',
            getter: (row) => {
              return this.userIsPartner
                ? row.orderedSIMCard.description
                : truncateLabel(row.orderedSIMCard.description, 20);
            },
          },
        },
        {
          id: 4,
          label: this.$t('col.status'),
          name: 'status',
          orderable: false,
          noHandle: true,
          visible: true,
          exportId: 'ORDER_STATUS',
          format: {
            component: GetSimOrdersStatusCell,
          },
        },
      ],
      rows: [],
      page: 0,
      pageLimit: 5,
      total: 0,
    };
  },
  watch: {
    async appliedFilters() {
      const pageInfo = { page: 0, limit: 3 };
      this.resultsPromise = searchOrders(this.orderBy, pageInfo, this.widgetFilters);
      const res = await this.resultsPromise;
      if (res.items) {
        this.rows = res.items;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
