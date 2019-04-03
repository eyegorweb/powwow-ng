<template>
  <LoaderContainer :is-loading="orderIsLoading">
    <div>
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
  </LoaderContainer>
</template>

<script>
import get from 'lodash.get';
import { fetchCustomFields } from '@/api/customFields';
import DataTable from '@/components/DataTable/DataTable';
import GetSimOrdersActions from './GetSimOrdersActions';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { exportFile } from '@/api/orders';
import sortBy from 'lodash.sortby';
import SearchByIdInput from './SearchByIdInput';
import LoaderContainer from '@/components/LoaderContainer';

import GetSimOrdersStatusCell from './GetSimOrdersStatusCell';
import GetSimOrdersDeliveryCell from './GetSimOrdersDeliveryCell';
import GetSimOrdersCreatorCell from './GetSimOrdersCreatorCell';
import GetSimOrdersIdCell from './GetSimOrdersIdCell';
import GetSimOrdersMassActionIdsColumn from './GetSimOrdersMassActionIdsColumn';
import GetSimOrdersBillingAccountCell from './GetSimOrdersBillingAccountCell';

/**
 * On est obligé de passer par une variable intérmédiaire car le localStorage ne stoque que des chaines de charactères
 */
const cellComponents = {
  GetSimOrdersStatusCell,
  GetSimOrdersDeliveryCell,
  GetSimOrdersCreatorCell,
  GetSimOrdersIdCell,
  GetSimOrdersMassActionIdsColumn,
  GetSimOrdersBillingAccountCell,
};

/**
 * pour définir un composant pour une céllule on a besoin de mettre le composant souhaité dans col.format.component
 * mais étant donné qu'on souhaite persister en local storage les colonnes de la table, on est alors obligé de stocker un identifiant en chaine
 * de caractères (componentId) pour que notre objet soit correctement sérialisé.
 *
 * cette fonction sert donc à assigner le bon composant dans col.format.component en se basant sur col.format.componentId
 */
function setFormatComponentsToColumns(columns) {
  return columns.reduce((preparedColumns, col) => {
    const formatted = { ...col };
    if (col.format && col.format.componentId) {
      formatted.format.component = cellComponents[col.format.componentId];
    }
    preparedColumns.push(formatted);
    return preparedColumns;
  }, []);
}

/**
 * assigne le bon composant de céllule
 */
function loadColumnsFromLocalStorage() {
  const strColumns = localStorage.getItem('getsim.savedColumns');
  if (!strColumns) return;
  const columns = JSON.parse(strColumns);
  return setFormatComponentsToColumns(columns);
}

function saveColumnsToLocalStorage(columns) {
  const savableColumns = JSON.parse(JSON.stringify(columns));
  localStorage.setItem('getsim.savedColumns', JSON.stringify(savableColumns));
}

export default {
  name: 'Orders',
  components: {
    DataTable,
    GetSimOrdersActions,
    SearchByIdInput,
    LoaderContainer,
  },
  props: {
    isPanelOpen: Boolean,
  },
  methods: {
    ...mapActions('getsim', ['fetchOrdersFromApi']),
    ...mapMutations('getsim', ['setPage']),
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
    ...mapGetters(['userIsPartner', 'userInfos']),
    ...mapGetters('getsim', ['appliedFilters', 'ordersResponse', 'orderPage', 'orderIsLoading']),
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
    columns(newValues) {
      saveColumnsToLocalStorage(newValues);
    },
  },

  async mounted() {
    const savedColumns = loadColumnsFromLocalStorage();
    if (savedColumns) {
      this.columns = savedColumns;
    } else {
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
        this.columns = setFormatComponentsToColumns([
          ...this.commonColumns,
          ...customFieldsColumns,
        ]);
      } else {
        this.columns = setFormatComponentsToColumns([...this.commonColumns]);
      }
    }
  },
  data() {
    return {
      columns: [],
      commonColumns: [
        {
          id: 1,
          label: this.$t('col.id'),
          name: 'id',
          orderable: true,
          visible: true,
          fixed: true,
          exportId: 'ORDER_ID',
          format: {
            componentId: 'GetSimOrdersIdCell',
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
            componentId: 'GetSimOrdersStatusCell',
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
            componentId: 'GetSimOrdersDeliveryCell',
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
            componentId: 'GetSimOrdersCreatorCell',
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
            componentId: 'GetSimOrdersBillingAccountCell',
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
            componentId: 'GetSimOrdersMassActionIdsColumn',
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
};
</script>

<style scoped lang="scss">
.export-link {
  color: $accent;
  float: right;
  &:hover {
    text-decoration: none;
  }
}
</style>
