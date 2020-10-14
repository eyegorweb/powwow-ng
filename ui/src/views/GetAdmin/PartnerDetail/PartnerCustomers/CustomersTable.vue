<template>
  <div>
    <BillingAccountDetail
      v-if="billingAccountToDetail"
      :billing-account-to-detail="billingAccountToDetail"
      @back="billingAccountToDetail = undefined"
      :partner="partner"
    />
    <div v-else-if="columns">
      <div class="row mb-3 mt-3">
        <div class="col-md-8">
          <h2 class="text-gray font-weight-light">
            {{ $t('getadmin.partnerDetail.mb.title', { total: total }) }}
          </h2>
        </div>
        <div class="col-md-4">
          <ExportButton :export-fn="getExportFn()" :columns="orderedColumns" :order-by="orderBy">
            <span slot="title">{{ $t('getadmin.partnerDetail.mb.export', { total: total }) }}</span>
          </ExportButton>
        </div>
      </div>
      <DataTable
        :columns.sync="columns"
        :rows="rows || []"
        :page.sync="page"
        :total="total || 0"
        :order-by.sync="orderBy"
        :page-limit.sync="pageLimit"
        :size="8"
        :show-extra-columns.sync="showExtraCells"
        @colEvent="$emit('colEvent', $event)"
        @columnOrdered="orderedColumns = $event"
      >
        <div slot="topLeftCorner">
          <SearchByCFReference
            @searchByLogin="searchByCF"
            @inputIsEmpty="clearSearch"
            :init-value="searchByCFValue"
          />
        </div>
      </DataTable>
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import BillingAccountDetail from './BillingAccountDetail/index.vue';
import BillAccountStatusCell from '@/views/GetAdmin/PartnerDetail/BillAccounts/BillAccountStatusCell.vue';
import SearchByCFReference from './SearchByCFReference';
import ExportButton from '@/components/ExportButton';

import { fetchCustomerAccountsByPartnerId, exportCustomerAccounts } from '@/api/partners.js';

import get from 'lodash.get';

export default {
  components: {
    DataTable,
    BillingAccountDetail,
    SearchByCFReference,
    ExportButton,
  },

  props: {
    partner: Object,
  },

  computed: {
    pageInfo() {
      return { page: this.page - 1, limit: this.pageLimit };
    },
    hasResults() {
      return !!(this.rows && this.rows.length);
    },
  },
  mounted() {
    this.refreshTable();
    this.ready = true;
  },

  data() {
    return {
      billingAccountToDetail: undefined,
      orderBy: {
        key: 'code',
        direction: 'DESC',
      },
      columns: [
        {
          id: 1,
          label: this.$t('getadmin.partnerDetail.mb.code'),
          name: 'code',
          orderable: true,
          visible: true,
          exportId: 'CUSTOMER_ACCOUNT_CODE',
          format: {
            type: 'LinkBtn',
            onClick: async (code, row) => {
              this.billingAccountToDetail = row;
            },
          },
        },
        {
          id: 2,
          label: this.$t('getadmin.partnerDetail.mb.name'),
          name: 'name',
          orderable: true,
          visible: true,
          exportId: 'CUSTOMER_ACCOUNT_NAME',
        },
        {
          id: 3,
          label: this.$t('getadmin.partnerDetail.mb.marketLine'),
          name: 'marketLine',
          orderable: true,
          visible: true,
          exportId: 'MARKET_LINE',
        },

        {
          id: 4,
          label: this.$t('getadmin.partnerDetail.mb.siren'),
          name: 'siren',
          orderable: true,
          visible: true,
          exportId: 'SIREN',
        },
        {
          id: 5,
          label: this.$t('col.status'),
          name: 'status',
          orderable: true,
          visible: true,
          exportId: 'CUSTOMER_ACCOUNT_STATUS',
          format: {
            component: BillAccountStatusCell,
          },
        },
        {
          id: 6,
          label: this.$t('col.creationDate'),
          name: 'created',
          orderable: true,
          visible: true,
          exportId: 'CUSTOMER_ACCOUNT_CREATED',
          format: {
            type: 'Getter',
            getter: (row) => {
              return get(row, 'auditable.created');
            },
          },
        },
      ],
      additionalFilters: [],
      searchByCFValue: undefined,
      total: 0,
      isLoading: false,
      showExtraCells: false,
      rows: undefined,
      page: 1,
      pageLimit: 20,
      orderedColumns: undefined,
    };
  },

  watch: {
    page() {
      if (!this.ready) return;
      this.refreshTable();
    },
    orderBy() {
      if (!this.ready) return;
      this.page = 1;
      this.refreshTable();
    },
    pageLimit() {
      if (!this.ready) return;
      this.page = 1;
      this.refreshTable();
    },
  },

  methods: {
    async refreshTable(additionalFilters = []) {
      this.isLoading = true;
      const response = await this.fetchApi(additionalFilters);
      this.isLoading = false;
      this.rows = response.rows;
      this.total = response.total;
    },
    async fetchApi(value) {
      this.searchByCFValue = value.length > 0 ? value[0] : '';
      try {
        const filters = [
          {
            id: 'getadmin.partners.filters.multisearch',
            value,
          },
        ];
        const response = await fetchCustomerAccountsByPartnerId(
          this.partner.id,
          this.orderBy,
          this.pageInfo,
          filters
        );
        return { rows: response.items, total: response.total };
      } catch (e) {
        console.log(e.message);
        return { rows: [], total: 0 };
      }
    },
    searchByCF(params) {
      this.refreshTable([params]);
    },
    clearSearch() {
      if (this.searchByCFValue) {
        this.searchByCFValue = undefined;
        this.refreshTable();
      }
    },
    getExportFn() {
      return async (columnsParam, orderBy, exportFormat, asyncExportRequest) => {
        const filters = [
          {
            id: 'getadmin.partners.filters.multisearch',
            value: this.searchByCFValue,
          },
        ];
        return await exportCustomerAccounts(
          this.partner.id,
          filters,
          columnsParam,
          this.orderBy,
          exportFormat,
          asyncExportRequest
        );
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
