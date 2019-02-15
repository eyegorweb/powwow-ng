<template>
  <DataTable
    :columns.sync="columns"
    :extra-columns="extraColumns"
    :rows="rows || []"
    :page.sync="page"
    :page-limit.sync="pageLimit"
    :total="total || 0"
    :order-by.sync="orderBy"
    :show-extra-columns.sync="showExtraColumns"
  />
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import GetSimOrdersStatusColumn from './GetSimOrdersStatusColumn';
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'Orders',
  components: {
    DataTable,
  },
  props: {
    isPanelOpen: Boolean,
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    ...mapActions(['fetchOrdersFromApi']),
    ...mapMutations(['setPage']),
    async fetchOrders() {
      this.fetchOrdersFromApi({
        orderBy: this.orderBy,
        pageInfo: this.getPageInfo,
        appliedFilters: this.appliedFilters,
      });
    },
  },
  computed: {
    ...mapGetters(['appliedFilters', 'ordersResponse', 'orderPage']),
    getPageInfo() {
      return { page: this.page - 1, limit: this.pageLimit };
    },
    total() {
      return this.ordersResponse ? this.ordersResponse.total : 0;
    },
    rows() {
      return this.ordersResponse ? this.ordersResponse.items : [];
    },
    page: {
      get() {
        return this.orderPage || 0;
      },
      set(newVal) {
        this.setPage(newVal);
      },
    },
  },
  watch: {
    orderPage() {
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
    isPanelOpen() {
      if (this.isPanelOpen) {
        this.showExtraColumns = false;
      }
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
          label: this.$t('col.externalId'),
          name: 'externalId',
          orderable: true,
        },
        {
          label: this.$t('col.managementId'),
          name: 'managementId',
          orderable: false,
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
          name: 'quantity',
        },
        {
          label: this.$t('col.product'),
          name: 'singleProduct',
          format: {
            type: 'ObjectAttribute',
            path: 'description',
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
        {
          label: this.$t('col.offer'),
          name: 'customerAccount',
          orderable: true,
          format: {
            type: 'ObjectAttribute',
            path: 'code',
          },
        },
      ],
      pageLimit: 20,
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      showExtraColumns: false,
    };
  },
};
</script>

<style scoped>
</style>
