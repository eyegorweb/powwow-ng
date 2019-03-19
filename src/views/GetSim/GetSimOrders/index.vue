<template>
  <div class="position-relative" :style="{ minHeight: '50vh' }">
    <!-- min-height pour gérer le positionnement du loader lorsqu'aucune commande n'est retournée -->
    <img class="loader" v-if="orderIsLoading" src="@/assets/spinner.svg" />
    <div :class="{ 'order-is-loading': orderIsLoading }">
      <div class="row mb-3">
        <div class="col">
          <h2 class="text-gray font-weight-light" style="font-size: 2rem">
            {{ $t('ordersFound', { total: total }) }}
          </h2>
        </div>
        <div class="col">
          <button class="btn btn-link export-link" @click="exportFile">
            <i class="ic-Download-Icon" />
            {{ $t('getsim.export', { total: total }) }}
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
        :show-extra-columns.sync="showExtraCells"
        @change-order="changeCellsOrder"
        :size="7"
      >
        <template slot="topLeftCorner">
          <SearchByIdInput />
        </template>
        <template slot="actions" slot-scope="{ row }">
          <GetSimOrdersActions :order="row" />
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script>
import get from 'lodash.get';
import { fetchCustomFields } from '@/api/customFields';
import DataTable from '@/components/DataTable/DataTable';
import GetSimOrdersStatusCell from './GetSimOrdersStatusCell';
import GetSimOrdersDeliveryCell from './GetSimOrdersDeliveryCell';
import GetSimOrdersCreatorCell from './GetSimOrdersCreatorCell';
import GetSimOrdersMassActionIdsColumn from './GetSimOrdersMassActionIdsColumn';
import GetSimOrdersIdCell from './GetSimOrdersIdCell';
import GetSimOrdersActions from './GetSimOrdersActions';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { exportFile } from '@/api/orders';
import sortBy from 'lodash.sortby';
import SearchByIdInput from './SearchByIdInput';

export default {
  name: 'Orders',
  components: {
    DataTable,
    GetSimOrdersActions,
    SearchByIdInput,
  },
  props: {
    isPanelOpen: Boolean,
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
    changeCellsOrder(orderedCells) {
      const notVisibleCells = this.columns.filter(c => !c.visible);
      this.columns = orderedCells.concat(notVisibleCells);
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
    ...mapGetters([
      'userIsPartner',
      'userInfos',
      'appliedFilters',
      'ordersResponse',
      'orderPage',
      'orderIsLoading',
    ]),
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
        this.showExtraCells = false;
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
            component: GetSimOrdersIdCell,
          },
        },
        {
          id: 2,
          label: this.$t('col.creationDate'),
          name: 'creationDate',
          orderable: true,
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
            component: GetSimOrdersStatusCell,
          },
        },
        {
          id: 5,
          label: this.$t('col.quantity'),
          name: 'quantity',
          orderable: true,
          visible: true,
          exportId: 'ORDER_QUANTITY',
        },
        {
          id: 6,
          label: this.$t('col.product'),
          name: 'orderedSimcard',
          orderable: false,
          visible: true,
          exportId: 'ORDER_ORDEREDSIMCARD',
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
          sortingName: 'destinataire',
          visible: false,
          exportId: 'ORDER_NAME',
          format: {
            component: GetSimOrdersDeliveryCell,
          },
        },
        // Offre
        {
          id: 12,
          label: this.$t('col.creator'),
          name: 'singleProduct',
          orderable: true,
          sortingName: 'creator',
          visible: false,
          exportId: 'ORDER_CREATOR',
          format: {
            component: GetSimOrdersCreatorCell,
          },
        },
        {
          id: 8,
          label: this.$t('col.partner'),
          name: 'party',
          orderable: true,
          sortingName: 'partyName',
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
          orderable: true,
          sortingName: 'customerAccountCode',
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
          orderable: true,
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
          orderable: true,
          visible: false,
          exportId: 'ORDER_ACTIVATIONASKED',
          format: {
            type: 'Boolean',
          },
        },
        {
          id: 13,
          label: this.$t('col.massActionIds'),
          name: 'massActionIds',
          visible: false,
          exportId: 'ORDER_MASSACTIONIDS',
          format: {
            component: GetSimOrdersMassActionIdsColumn,
          },
        },
      ],
      pageLimit: 20,
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      showExtraCells: false,
    };
  },
  async mounted() {
    if (this.userIsPartner) {
      const partnerId = get(this.userInfos, 'party.id');
      const customFields = await fetchCustomFields(partnerId);
      const customFieldsColumns = customFields.map(c => {
        return {
          id: c.id,
          label: c.label,
          name: 'customFields',
          orderable: false,
          visible: false,
          // exportId: 'ORDER_STATUS',
          format: {
            type: 'ObjectAttribute',
            path: c.codeInOrder,
          },
        };
      });
      this.columns = [...this.columns, ...customFieldsColumns];
    }
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
