<template>
  <PaginatedDataTable
    :columns="columns"
    :order="defaultOrderBy"
    :fetch-data-fn="getFetchFn()"
    :size="8"
  />
</template>

<script>
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable.vue';
import BillAccountStatusCell from './BillAccountStatusCell';

import { fetchCustomerAccountsByPartnerId } from '@/api/partners.js';

export default {
  components: {
    PaginatedDataTable,
  },
  props: {
    partner: {
      type: Object,
    },
  },

  data() {
    return {
      account: undefined,

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
            onClick: async code => {
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
