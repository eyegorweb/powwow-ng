<template>
  <DataTable
    :columns.sync="columns"
    :extra-columns="extraColumns"
    :rows="rows"
    :page.sync="page"
    :page-limit.sync="pageLimit"
    :total.sync="total"
    :order-by.sync="orderBy"
  />
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import { searchOrders } from '@/api/orders';
import GetSimOrdersStatusColumn from './GetSimOrdersStatusColumn';
import { mapGetters } from 'vuex';

export default {
  name: 'Orders',
  components: {
    DataTable,
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      const data = await searchOrders(this.orderBy, this.getPageInfo, this.appliedFilters);
      this.total = data.total;
      this.rows = data.items;
    },
  },
  computed: {
    ...mapGetters(['appliedFilters']),
    getPageInfo() {
      return { page: this.page - 1, limit: this.pageLimit };
    },
  },
  watch: {
    page() {
      this.fetchOrders();
    },
    orderBy() {
      this.page = 1;
      this.fetchOrders();
    },
    pageLimit() {
      this.page = 1;
      this.fetchOrders();
    },
    appliedFilters() {
      this.fetchOrders();
    },
  },
  data() {
    return {
      columns: [
        {
          label: this.$t('col.id'),
          name: 'id',
          orderable: true,
          format: {
            type: 'LinkBtn',
            onClick(item) {
              console.info('Ouverture du panel pour la commande id = ', item);
            },
          },
        },
        {
          label: this.$t('col.creationDate'),
          name: 'creationDate',
          orderable: true,
          format: {
            type: 'Date',
          },
        },
        {
          label: this.$t('col.status'),
          name: 'status',
          orderable: true,
          format: {
            component: GetSimOrdersStatusColumn,
          },
        },
        {
          label: this.$t('col.quantity'),
          name: 'orderItems',
          format: {
            type: 'ObjectAttribute',
            path: '[0].quantity',
          },
        },
        {
          label: this.$t('col.product'),
          name: 'orderItems',
          format: {
            type: 'ObjectAttribute',
            path: '[0].orderedProduct.description',
          },
        },
      ],
      extraColumns: [
        {
          label: this.$t('col.activationAsked'),
          name: 'activationAsked',
          orderable: false,
          format: {
            type: 'Boolean',
          },
        },
      ],
      rows: [],
      page: 1,
      pageLimit: 20,
      total: 0,
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
    };
  },
};
</script>

<style scoped>
</style>
