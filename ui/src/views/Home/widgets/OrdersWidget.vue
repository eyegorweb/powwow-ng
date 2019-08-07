<template>
  <WidgetBloc :widget="widget" @seeMore="onSeeMore">
    <Promised :promise="resultsPromise">
      <div slot="pending">{{ $t('loading') }}...</div>
      <div v-if="!rows || !rows.length" class="alert alert-light" role="alert">
        {{ $t('noResult') }}
      </div>
      <DataTable
        v-else
        :columns="columns"
        :rows="rows || []"
        :page.sync="page"
        :page-limit.sync="pageLimit"
        :total="total || 0"
        :order-by.sync="orderBy"
      />
    </Promised>
  </WidgetBloc>
</template>

<script>
import { Promised } from 'vue-promised';
import DataTable from '@/components/DataTable/DataTable';
import { searchOrders } from '@/api/orders';
import GetSimOrdersProductCell from '@/views/GetSim/GetSimOrders/GetSimOrdersProductCell';
import GetSimOrdersStatusCell from '@/views/GetSim/GetSimOrders/GetSimOrdersStatusCell';
import { mapGetters } from 'vuex';
import WidgetBloc from './WidgetBloc';
// import moment from 'moment';

export default {
  components: {
    DataTable,
    Promised,
    WidgetBloc,
  },
  props: {
    widget: Object,
  },
  computed: {
    ...mapGetters(['userIsPartner']),
    ...mapGetters('getsim', ['appliedFilters']),

    columns() {
      if (this.userIsPartner) {
        return this.allColumns.filter(c => c.name !== 'party');
      }
      return this.allColumns;
    },
  },
  methods: {
    onSeeMore() {
      this.$router.push({
        name: 'orders',
        params: {
          queryFilters: [...this.widgetFilters],
        },
      });
    },
  },
  data() {
    return {
      widgetFilters: [
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
          ],
        },
        /*
        {
          id: 'filters.orderDate',
          startDate: moment()
            .subtract(6, 'month')
            .format('DD-MM-YYYY'),
          endDate: moment().format('DD-MM-YYYY'),
        },
        //*/
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
            onClick: orderId => {
              this.$router.push({
                name: 'orders',
                params: {
                  openDetailPanel: true,
                  queryFilters: [{ id: 'filters.idOrder', value: orderId, hidden: false }],
                },
              });
            },
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
          format: {
            type: 'ObjectAttribute',
            path: 'name',
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
          format: {
            component: GetSimOrdersProductCell,
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
      orderBy: { key: 'creationDate', direction: 'DESC' },
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
