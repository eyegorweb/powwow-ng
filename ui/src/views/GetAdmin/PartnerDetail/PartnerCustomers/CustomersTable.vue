<template>
  <div>
    <BillingAccountDetail
      v-if="billingAccountToDetail"
      :billing-account-to-detail="billingAccountToDetail"
      @back="billingAccountToDetail = undefined"
    />
    <PaginatedDataTable
      v-else-if="columns"
      :columns="columns"
      :order="defaultOrderBy"
      :fetch-data-fn="getFetchFn()"
      :size="8"
    />
  </div>
</template>

<script>
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable.vue';
import BillingAccountDetail from './BillingAccountDetail/index.vue';
import BillAccountStatusCell from '@/views/GetAdmin/PartnerDetail/BillAccounts/BillAccountStatusCell.vue';

import { fetchCustomerAccountsByPartnerId } from '@/api/partners.js';

export default {
  components: {
    PaginatedDataTable,
    BillingAccountDetail,
  },

  props: {
    partner: Object,
  },

  data() {
    return {
      billingAccountToDetail: undefined,
      defaultOrderBy: {
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
          orderable: false,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('getadmin.partnerDetail.mb.marketLine'),
          name: 'marketLine',
          orderable: false,
          visible: true,
        },
        {
          id: 4,
          label: this.$t('getadmin.partnerDetail.mb.siret'),
          name: 'siret',
          orderable: false,
          visible: true,
        },
        {
          id: 5,
          label: this.$t('col.status'),
          name: 'status',
          orderable: false,
          visible: true,
          format: {
            component: BillAccountStatusCell,
          },
        },
        {
          id: 6,
          label: this.$t('col.creationDate'),
          name: 'auditable',
          orderable: true,
          visible: true,
          format: { type: 'ObjectAttribute', path: 'created' },
        },
      ],
    };
  },

  methods: {
    getFetchFn() {
      return async (pageInfo, orderInfo) => {
        const response = await fetchCustomerAccountsByPartnerId(
          this.partner.id,
          orderInfo,
          pageInfo
        );
        return {
          rows: response.items,
          total: response.total,
        };
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
