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
      const data = await searchOrders(this.fieldsToSearch, this.orderBy, this.getPageInfo);
      this.total = data.total;
      this.rows = this.formatOrders(data.orders);
    },
    formatOrders(orders) {
      return orders.map(o => {
        if (o.singleProduct && o.singleProduct.description) {
          o.singleProduct = o.singleProduct.description;
        }
        return o;
      });
    },
  },
  computed: {
    fieldsToSearch() {
      const allColumnts = this.columns.concat(this.extraColumns);
      return allColumnts.map(f => f.name);
    },
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
  },
  data() {
    return {
      columns: [
        {
          label: 'ID',
          name: 'id',
          orderable: false,
        },
        {
          label: 'Date de création',
          name: 'creationDate',
          orderable: false,
        },
        {
          label: 'Date de commande',
          name: 'orderDate',
          orderable: true,
        },
      ],
      extraColumns: [
        {
          label: 'Active',
          name: 'activationAsked',
          orderable: false,
        },
      ],
      rows: [],
      page: 1,
      pageLimit: 20,
      total: 0,
      orderBy: {
        key: 'orderDate',
        direction: 'DESC',
      },
    };
  },
};
</script>

<style scoped>
</style>
