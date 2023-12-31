<template>
  <LoaderContainer :is-loading="isLoading">
    <div slot="on-loading">
      <SearchResultSkeleton :columns="columns" />
    </div>
    <div v-if="columns">
      <div class="row mb-3">
        <div class="col">
          <h2 class="text-gray font-weight-light total" style="font-size: 2rem">
            {{ $t('ordersFound', { total: formattedTotal }) }}
          </h2>
        </div>
        <div class="col" v-if="total > 0">
          <ExportButton
            export-all
            :export-fn="getExportFn()"
            :columns="columns"
            :order-by="orderBy"
          >
            <span slot="title">{{ $t('getsim.export', { total: formattedTotal }) }}</span>
          </ExportButton>
        </div>
      </div>
      <template v-if="rows && rows.length">
        <DataTable
          :storage-id="storageId"
          storage-version="004"
          :columns="columns"
          :rows="rows || []"
          :page.sync="page"
          :page-limit.sync="pageLimit"
          :total="total || 0"
          :order-by.sync="orderBy"
          :show-extra-columns.sync="showExtraCells"
          :size="7"
          @columnOrdered="orderedColumns = $event"
        >
          <template slot="topLeftCorner">
            <SearchOrderById @searchById="searchById" :init-value="searchByIdValue" />
          </template>
          <template slot="actions" slot-scope="{ row }">
            <GetSimOrdersActions
              :order="row"
              :export-fn="getExportLinesFn(row.id)"
              :columns="columns"
              :order-by="orderBy"
            />
          </template>
        </DataTable>
      </template>
      <template v-else>
        <div v-if="searchByIdValue">
          <button class="btn btn-link" @click="resetFilters">{{ $t('resetFilters') }}</button>
        </div>
        <div class="alert alert-light">{{ $t('noResult') }}</div>
      </template>
    </div>
  </LoaderContainer>
</template>

<script>
import get from 'lodash.get';

import { fetchCustomFields } from '@/api/customFields';
import DataTable from '@/components/DataTable/DataTable';
import GetSimOrdersActions from './GetSimOrdersActions';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { ordersExport } from '@/api/orders';
import { exportSimCardInstances } from '@/api/linesActions';
import SearchOrderById from './SearchOrderById';
import LoaderContainer from '@/components/LoaderContainer';
import ExportButton from '@/components/ExportButton';

import GetSimOrdersStatusCell from './GetSimOrdersStatusCell';
import GetSimOrdersDeliveryCell from './GetSimOrdersDeliveryCell';
import GetSimOrdersCreatorCell from './GetSimOrdersCreatorCell';
import GetSimOrdersIdCell from './GetSimOrdersIdCell';
import GetSimOrdersMassActionIdsColumn from './GetSimOrdersMassActionIdsColumn';
import GetSimOrdersBillingAccountCell from './GetSimOrdersBillingAccountCell';
import GetSimOrdersProductCell from './GetSimOrdersProductCell';
import SearchResultSkeleton from '@/components/ui/skeletons/SearchResultSkeleton';
import { formatLargeNumber } from '@/utils/numbers';

export default {
  name: 'Orders',
  components: {
    DataTable,
    GetSimOrdersActions,
    SearchOrderById,
    LoaderContainer,
    ExportButton,
    SearchResultSkeleton,
  },
  props: {
    isPanelOpen: Boolean,
  },
  methods: {
    ...mapActions('getsim', ['fetchOrdersFromApi']),
    ...mapMutations('getsim', [
      'forceAppliedFilters',
      'setPage',
      'setCurrentFilters',
      'applyFilters',
    ]),
    getExportFn() {
      return async (columns, orderBy, exportFormat, asyncExportRequest, exportAll) => {
        let columnsToUse = columns;
        let orderToUse = orderBy;
        let filtersToUse = this.appliedFilters;
        if (exportAll) {
          orderToUse = { direction: 'DESC', key: 'id' };
          columnsToUse = [];
        }
        return await ordersExport(
          columnsToUse,
          orderToUse,
          exportFormat,
          filtersToUse,
          asyncExportRequest,
          exportAll
        );
      };
    },
    getExportLinesFn(orderID) {
      return async (columns, orderBy, exportFormat, asyncExportRequest, exportAll) => {
        let columnsToUse = [
          'LINE_ICCID',
          'PARTY_ID',
          'LINE_MSISDN',
          'LINE_IMSI',
          'LINE_SIM_STATUS',
          'LINE_COMMERCIAL_DATE',
          'LINE_COMMERCIAL_STATUS',
          'LINE_OFFER',
          'LINE_AMSISDN',
          'LINE_MANUFACTURER',
          'LINE_DEVICE_REFERENCE',
          'LINE_ACTIVATION_DATE',
          'BILLING_ACCOUNT',
          'LAST_COUNTRY',
          'LINE_CUSTOM_FIELD1',
          'LINE_CUSTOM_FIELD2',
          'LINE_CUSTOM_FIELD3',
          'LINE_CUSTOM_FIELD4',
          'LINE_CUSTOM_FIELD5',
          'LINE_CUSTOM_FIELD6',
        ];
        if (this.havePermission('getVision', 'read')) {
          columnsToUse.push('LAST_COUNTRY');
        }
        let orderToUse = { direction: 'DESC', key: 'id' };
        let filtersToUse = [{ id: 'filters.lines.orderID', value: orderID }];
        return await exportSimCardInstances(
          columnsToUse,
          orderToUse,
          exportFormat,
          filtersToUse,
          asyncExportRequest,
          exportAll,
          'CLASSIC'
        );
      };
    },
    resetFilters() {
      this.searchByIdValue = undefined;
      this.forceAppliedFilters([]);
    },
    async fetchOrders() {
      this.fetchOrdersFromApi({
        orderBy: this.orderBy,
        pageInfo: this.getPageInfo,
        appliedFilters: this.appliedFilters,
      });
    },

    searchById(params) {
      if (params) {
        this.searchByIdValue = params.value;
        // la table de résultats ( GetSimOrders) lance une recherche à chaque fois que le filtre est modifié ( appliqué ), pour effectuer une recherche par ID,
        // on applique directement un filtre sans passer par le process normal ( selection -> appliquer les filtres)
        this.forceAppliedFilters([
          {
            id: params.id,
            value: params.value,
          },
        ]);
      } else {
        this.searchByIdValue = undefined;
        this.applyFilters();
      }
    },
  },
  computed: {
    ...mapGetters(['userIsPartner', 'userInfos', 'userName', 'havePermission']),
    ...mapGetters('getsim', ['appliedFilters', 'ordersResponse', 'orderPage', 'isLoading']),
    formattedTotal() {
      return formatLargeNumber(this.total);
    },
    storageId() {
      return this.userName + 'getsim.orders';
    },
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
      this.page = 1;
      this.fetchOrders();
    },
    isPanelOpen() {
      if (this.isPanelOpen) {
        this.showExtraCells = false;
      }
    },
  },

  async mounted() {
    if (this.userIsPartner) {
      const partnerId = get(this.userInfos, 'partners[0].id');

      const customFields = await fetchCustomFields(partnerId);
      const partnerCustomFieldsColumns = customFields.customFields.map((c) => {
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
      this.columns = [...this.commonColumns, ...partnerCustomFieldsColumns];
    } else {
      this.columns = [...this.commonColumns, ...this.defaultCustomFieldsColumns];
    }
  },
  data() {
    return {
      columns: undefined,
      searchByIdValue: undefined,
      orderedColumns: undefined,
      commonColumns: [
        {
          id: 1,
          label: this.$t('col.id'),
          name: 'id',
          orderable: true,
          noHandle: true,
          visible: true,
          fixed: true,
          exportId: 'ORDER_ID',
          format: {
            component: GetSimOrdersIdCell,
          },
        },
        {
          id: 2,
          label: this.$t('col.externalId'),
          name: 'externalId',
          orderable: true,
          visible: false,
          exportId: 'ORDER_REFERENCE',
        },
        {
          id: 3,
          label: this.$t('col.creationDate'),
          name: 'creationDate',
          orderable: true,
          visible: true,
          exportId: 'ORDER_CREATED',
          format: {
            type: 'Date',
          },
        },
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
          label: this.$t('col.product'),
          name: 'orderedSIMCard',
          orderable: true,
          visible: true,
          sortingName: 'simcardDesc',
          exportId: 'ORDER_SIMCARD_TYPE',
          format: {
            component: GetSimOrdersProductCell,
          },
        },
        {
          id: 6,
          label: this.$t('col.quantity'),
          name: 'quantity',
          orderable: true,
          visible: true,
          exportId: 'ORDER_QUANTITY',
        },
        {
          id: 7,
          label: this.$t('col.offer'),
          name: 'orderedMarketingOffer',
          orderable: true,
          visible: false,
          exportId: 'ORDER_OFFER',
          format: {
            type: 'ObjectAttribute',
            path: 'description',
          },
        },
        {
          id: 8,
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
          id: 9,
          label: this.$t('col.recipient'),
          name: 'singleProduct',
          orderable: true,
          sortingName: 'destinataire',
          visible: false,
          exportId: 'ORDER_RECIPIENT',
          format: {
            component: GetSimOrdersDeliveryCell,
          },
        },
        {
          id: 10,
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
          id: 11,
          label: this.$t('col.billingAccount'),
          name: 'customerAccount',
          orderable: true,
          sortingName: 'customerAccountCode',
          visible: false,
          exportId: 'ORDER_CUSTOMERACCOUNT',
          format: {
            component: GetSimOrdersBillingAccountCell,
          },
        },
        {
          id: 12,
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
          id: 13,
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
          id: 14,
          label: this.$t('col.massActionIds'),
          name: 'massActionIds',
          visible: false,
          format: {
            component: GetSimOrdersMassActionIdsColumn,
          },
        },
      ],
      defaultCustomFieldsColumns: [
        {
          id: 15,
          label: this.$t('col.customFields', { num: 1 }),
          name: 'customFields',
          visible: false,
          exportId: 'ORDER_CUSTOMFIELD_1',
          format: {
            type: 'ObjectAttribute',
            path: 'custom1',
          },
        },
        {
          id: 16,
          label: this.$t('col.customFields', { num: 2 }),
          name: 'customFields',
          visible: false,
          exportId: 'ORDER_CUSTOMFIELD_2',
          format: {
            type: 'ObjectAttribute',
            path: 'custom2',
          },
        },
        {
          id: 17,
          label: this.$t('col.customFields', { num: 3 }),
          name: 'customFields',
          visible: false,
          exportId: 'ORDER_CUSTOMFIELD_3',
          format: {
            type: 'ObjectAttribute',
            path: 'custom3',
          },
        },
        {
          id: 18,
          label: this.$t('col.customFields', { num: 4 }),
          name: 'customFields',
          visible: false,
          exportId: 'ORDER_CUSTOMFIELD_4',
          format: {
            type: 'ObjectAttribute',
            path: 'custom4',
          },
        },
        {
          id: 19,
          label: this.$t('col.customFields', { num: 5 }),
          name: 'customFields',
          visible: false,
          exportId: 'ORDER_CUSTOMFIELD_5',
          format: {
            type: 'ObjectAttribute',
            path: 'custom5',
          },
        },
        {
          id: 20,
          label: this.$t('col.customFields', { num: 6 }),
          name: 'customFields',
          visible: false,
          exportId: 'ORDER_CUSTOMFIELD_6',
          format: {
            type: 'ObjectAttribute',
            path: 'custom6',
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

.total-row h2 {
  display: inline;
}
</style>
