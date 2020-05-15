<template>
  <div>
    <DataTable :columns.sync="columns" :rows="rows || []" :order-by.sync="orderBy"></DataTable>
  </div>
</template>

<script>
import { fetchCustomerAccounts } from '@/api/partners.js';
import DataTable from '@/components/DataTable/DataTable';
import BillAccountStatusCell from './BillAccountStatusCell';

export default {
  props: {
    partner: {
      type: Object,
    },
  },
  components: {
    DataTable,
  },

  async mounted() {
    this.accounts = await fetchCustomerAccounts(this.partner.id);
    this.refreshTable();
  },

  data() {
    return {
      accounts: undefined,
      lines: undefined,
      columns: [
        {
          id: 1,
          label: this.$t('common.code'),
          name: 'code',
          orderable: true,
          visible: true,
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
          name: 'created',
          orderable: true,
          visible: true,
        },
      ],
      rows: [],
      orderBy: {
        key: 'code',
        direction: 'DESC',
      },
    };
  },

  methods: {
    refreshTable() {
      this.rows = this.accounts.map(l => ({
        code: l.code,
        name: l.name,
        company: l.company,
        status: l.status,
        created: l.auditable.created,
      }));
    },
  },

  computed: {},
};
</script>

<style lang="scss" scoped></style>
