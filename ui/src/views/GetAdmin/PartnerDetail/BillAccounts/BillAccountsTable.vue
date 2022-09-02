<template>
  <div>
    <div class="row">
      <div class="col-md-9"></div>
      <div class="col-md-3">
        <permission domain="party" action="create_customer_account">
          <UiButton variant="accent" block class="float-right" @click="createCustomerAccount()">
            {{ $t('getadmin.partnerDetail.addCustomerAccount') }}
          </UiButton>
        </permission>
      </div>
    </div>

    <div class="mt-4">
      <DataTable
        :columns="columns"
        :rows="rows"
        :total="total"
        :order-by.sync="defaultOrderBy"
        :is-loading="isLoading"
      >
        <template slot="topLeftCorner">
          <SearchByCFReference
            @searchByLogin="searchByCF"
            @inputIsEmpty="clearSearch"
            :init-value="searchByCFValue"
            :place-holder="'searchByCFPartner'"
          />
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script>
import BillAccountStatusCell from './BillAccountStatusCell';
import UiButton from '@/components/ui/Button';
import DataTable from '@/components/DataTable/DataTable';
import { fetchAllCustomerAccounts } from '@/api/customerAccounts';

import SearchByCFReference from '../PartnerCustomers/SearchByCFReference';

export default {
  components: {
    UiButton,
    DataTable,
    SearchByCFReference,
  },
  props: {
    partner: {
      type: Object,
    },
  },

  data() {
    return {
      searchByCFValue: undefined,
      rows: [],
      total: 0,
      account: undefined,
      isLoading: false,

      defaultOrderBy: {
        key: 'code',
        direction: 'DESC',
      },
      columns: [
        {
          id: 1,
          label: this.$t('common.code'),
          name: 'code',
          orderable: true,
          visible: true,
          format: {
            type: 'LinkBtn',
            onClick: async (code) => {
              this.$router.push({
                name: 'getAdminPartnerDetails.billingAccounts.form',
                params: { id: this.$route.params.id, customerAccountCode: code },
              });
            },
          },
        },
        {
          id: 2,
          label: this.$t('col.label'),
          name: 'name',
          orderable: true,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('col.company'),
          name: 'company',
          orderable: true,
          visible: true,
        },
        {
          id: 4,
          label: this.$t('col.status'),
          name: 'status',
          orderable: true,
          visible: true,
          format: {
            component: BillAccountStatusCell,
          },
        },
        {
          id: 5,
          label: this.$t('col.creationDate'),
          name: 'auditable',
          orderable: true,
          visible: true,
          format: { type: 'ObjectAttribute', path: 'created' },
        },
      ],
    };
  },

  mounted() {
    this.applyFilters();
  },

  methods: {
    searchByCF(params) {
      this.applyFilters({
        pagination: { page: 0, limit: 20 },
        filters: [{ id: 'getadmin.cf.filters.multiSearch', value: params }],
      });
    },

    resetFilters() {
      this.searchByCFValue = undefined;
      this.applyFilters();
    },
    async applyFilters(payload) {
      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 20 },
        filters: [],
      };
      this.isLoading = true;
      const allFilters = [
        {
          id: 'partner.id',
          value: this.partner.id,
        },
        ...filters,
      ];

      const data = await fetchAllCustomerAccounts(allFilters, pagination, this.defaultOrderBy);
      this.isLoading = false;
      this.total = data.total;
      this.rows = data.items;
    },
    createCustomerAccount() {
      this.$router.push({
        name: 'getAdminPartnerDetails.billingAccounts.form',
        params: { id: this.$route.params.id, customerAccountCode: undefined },
      });
    },
    clearSearch() {
      if (!this.searchByCFValue) {
        this.searchByCFValue = undefined;
        this.applyFilters();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
