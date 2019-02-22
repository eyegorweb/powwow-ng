<template>
  <div>
    <div class="row mb-3 col-md-9">
      <h2 class="text-gray" :style="{fontSize: '24px', fontWeight: '300'}">{{ `${total} ${$t('ordersFound')}` }}</h2>
    </div>
    <DataTable
      :columns.sync="columns"
      :extra-columns="extraColumns"
      :rows="rows || []"
      :page.sync="page"
      :page-limit.sync="pageLimit"
      :total="total || 0"
      :order-by.sync="orderBy"
      :show-extra-columns.sync="showExtraColumns"
    >
      <template slot="actions" slot-scope="{ row }">
        <GetSimOrdersActions :order="row" />
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import GetSimOrdersStatusColumn from './GetSimOrdersStatusColumn';
import GetSimOrdersDeliveryColumn from './GetSimOrdersDeliveryColumn';
import GetSimOrdersCreatorColumn from './GetSimOrdersCreatorColumn';
import GetSimOrdersIdColumn from './GetSimOrdersIdColumn';
import GetSimOrdersActions from './GetSimOrdersActions';
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'Orders',
  components: {
    DataTable,
    GetSimOrdersActions,
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
          id: 1,
          label: this.$t('col.id'),
          name: 'id',
          orderable: true,
          format: {
            component: GetSimOrdersIdColumn,
          },
        },
        {
          id: 2,
          label: this.$t('col.creationDate'),
          name: 'creationDate',
          format: {
            type: 'Date',
          },
        },
        /*
        {
          id: 3,
          label: this.$t('col.externalId'),
          name: 'externalId',
        },
        //*/
        // Id de gestion ( tableau, comment afficher ?)
        {
          id: 4,
          label: this.$t('col.status'),
          name: 'status',
          orderable: true,
          format: {
            component: GetSimOrdersStatusColumn,
          },
        },
        {
          id: 5,
          label: this.$t('col.quantity'),
          name: 'quantity',
        },
        {
          id: 6,
          label: this.$t('col.product'),
          name: 'simCardType',
          format: {
            type: 'ObjectAttribute',
            path: 'name',
          },
        },
      ],
      extraColumns: [
        {
          id: 7,
          label: this.$t('col.recipient'),
          name: 'singleProduct',
          orderable: true,
          format: {
            component: GetSimOrdersDeliveryColumn,
          },
        },
        // Offre
        {
          id: 12,
          label: this.$t('col.creator'),
          name: 'singleProduct',
          orderable: true,
          format: {
            component: GetSimOrdersCreatorColumn,
          },
        },
        {
          id: 8,
          label: this.$t('col.partner'),
          name: 'party',
          format: {
            type: 'ObjectAttribute',
            path: 'name',
          },
        },
        {
          id: 9,
          label: this.$t('col.billingAccount'),
          name: 'customerAccount',
          orderable: true,
          format: {
            type: 'ObjectAttribute',
            path: 'code',
          },
        },
        {
          id: 10,
          label: this.$t('col.preActivationAsked'),
          name: 'preActivationAsked',
          orderable: false,
          format: {
            type: 'Boolean',
          },
        },
        {
          id: 11,
          label: this.$t('col.activationAsked'),
          name: 'activationAsked',
          orderable: false,
          format: {
            type: 'Boolean',
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
