<template>
  <div class="position-relative" :style="{minHeight: '50vh'}"> <!-- min-height pour gérer le positionnement du loader lorsqu'aucune commande n'est retournée -->
    <img
      class="loader"
      v-if="orderIsLoading"
      src="@/assets/spinner.svg"
    >
    <div :class="{'order-is-loading': orderIsLoading}">
      <div class="row mb-3">
        <div class="col">
          <h2 class="text-gray font-weight-light" style="font-size: 2rem">{{ $t('ordersFound', {'total': total}) }}</h2>
        </div>
        <div class="col">
          <button class="btn btn-link export-link" @click="exportFile">
            <i class="ic-Download-Icon" />
            {{ $t('getsim.export', {'total': total}) }}
          </button>
        </div>

      </div>
      <DataTable
        :columns.sync="columns"
        :rows="rows || []"
        :page.sync="page"
        :page-limit.sync="pageLimit"
        :total="total || 0"
        :order-by.sync="orderBy"
        :show-extra-columns.sync="showExtraColumns"
        @change-order="changeColumnsOrder"
        :size="7"
      >
        <template slot="actions" slot-scope="{ row }">
          <GetSimOrdersActions :order="row" />
        </template>
      </DataTable>

    </div>
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
import { exportFile } from '@/api/orders';
import sortBy from 'lodash.sortby';

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
    changeColumnsOrder(orderedColumns) {
      const notVisibleColumns = this.columns.filter(c => !c.visible);
      this.columns = orderedColumns.concat(notVisibleColumns);
    },
    async exportFile() {
      const columnsParam = sortBy(this.columns, c => !c.visible)
        .filter(c => c.exportId)
        .map(c => c.exportId);
      const downloadResponse = await exportFile(columnsParam, this.orderBy, this.appliedFilters);
      if (downloadResponse && downloadResponse.downloadUri) {
        window.open(downloadResponse.downloadUri, '_blank');
      }
    },
  },
  computed: {
    ...mapGetters(['appliedFilters', 'ordersResponse', 'orderPage', 'orderIsLoading']),
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
          visible: true,
          fixed: true,
          exportId: 'ORDER_ID',
          format: {
            component: GetSimOrdersIdColumn,
          },
        },
        {
          id: 2,
          label: this.$t('col.creationDate'),
          name: 'creationDate',
          visible: true,
          exportId: 'ORDER_CREATED',
          format: {
            type: 'Date',
          },
        },
        /*
        {
          id: 3,
          label: this.$t('col.externalId'),
          name: 'externalId',
          exportId: 'ORDER_EXTERNALID'
        },
        //*/
        // Id de gestion ( tableau, comment afficher ?) , exportId= ORDER_MASSACTIONIDS
        {
          id: 4,
          label: this.$t('col.status'),
          name: 'status',
          orderable: true,
          visible: true,
          exportId: 'ORDER_STATUS',
          format: {
            component: GetSimOrdersStatusColumn,
          },
        },
        {
          id: 5,
          label: this.$t('col.quantity'),
          name: 'quantity',
          visible: true,
          exportId: 'ORDER_QUANTITY',
        },
        {
          id: 6,
          label: this.$t('col.product'),
          name: 'orderedSimcard',
          visible: true,
          // exportId: 'ORDER_ORDEREDSIMCARD',
          format: {
            type: 'ObjectAttribute',
            path: 'description',
          },
        },
        {
          id: 7,
          label: this.$t('col.recipient'),
          name: 'singleProduct',
          orderable: true,
          visible: false,
          exportId: 'ORDER_NAME',
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
          visible: false,
          exportId: 'ORDER_CREATOR',
          format: {
            component: GetSimOrdersCreatorColumn,
          },
        },
        {
          id: 8,
          label: this.$t('col.partner'),
          name: 'party',
          visible: false,
          exportId: 'ORDER_PARTY',
          format: {
            type: 'ObjectAttribute',
            path: 'name',
          },
        },
        {
          id: 9,
          label: this.$t('col.billingAccount'),
          name: 'customerAccount',
          orderable: false,
          visible: false,
          exportId: 'ORDER_CUSTOMERACCOUNT',
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
          visible: false,
          exportId: 'ORDER_PREACTIVATIONASKED',
          format: {
            type: 'Boolean',
          },
        },
        {
          id: 11,
          label: this.$t('col.activationAsked'),
          name: 'activationAsked',
          orderable: false,
          visible: false,
          exportId: 'ORDER_ACTIVATIONASKED',
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

<style scoped lang="scss">
.loader {
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
}
.order-is-loading {
  position: relative;
  pointer-events: none;
  opacity: 0.5;

  /deep/ .table-blue thead {
    background-color: $gray;
  }

  /deep/ .pagination {
    .page-item:not(.disabled) {
      .page-link {
        color: $gray;
      }
    }
  }

  /deep/ a {
    color: $gray;
  }

  /deep/ button {
    color: $gray;
  }
}

.export-link {
  color: $accent;
  float: right;
  &:hover {
    text-decoration: none;
  }
}
</style>
