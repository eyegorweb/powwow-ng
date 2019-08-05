<template>
  <div>
    <Promised :promise="resultsPromise">
      <div slot="pending">{{ $t('loading') }}...</div>
      <DataTable
        :columns="columns"
        :rows="rows || []"
        :page.sync="page"
        :page-limit.sync="pageLimit"
        :total="total || 0"
        :order-by.sync="orderBy"
      />
    </Promised>
  </div>
</template>

<script>
import { Promised } from 'vue-promised';
import DataTable from '@/components/DataTable/DataTable';
import { searchOrders } from '@/api/orders';
import GetSimOrdersProductCell from '@/views/GetSim/GetSimOrders/GetSimOrdersProductCell';
import GetSimOrdersStatusCell from '@/views/GetSim/GetSimOrders/GetSimOrdersStatusCell';
import { mapGetters } from 'vuex';

export default {
  components: {
    DataTable,
    Promised,
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
  data() {
    return {
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
      this.resultsPromise = searchOrders(this.orderBy, pageInfo, this.appliedFilters);
      const res = await this.resultsPromise;
      if (res.items) {
        this.rows = res.items;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
