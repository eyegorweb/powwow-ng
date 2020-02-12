<template>
  <DataTable
    :columns="columns"
    :rows="rows || []"
    :page.sync="page"
    :page-limit.sync="pageLimit"
    :total="total || 0"
    :order-by.sync="orderBy"
    :show-extra-columns.sync="showExtraCells"
    :size="7"
  >
    <template slot="actions" slot-scope="{ row }">
      <ReportsActions :report="row" />
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import ReportsActions from './ReportsActions';
import { fetchData } from '@/api/mockApi.js';

export default {
  components: {
    DataTable,
    ReportsActions,
  },
  data() {
    return {
      page: 1,
      pageLimit: 10,
      showExtraCells: false,
      columns: [
        {
          id: 2,
          label: this.$t('col.id'),
          orderable: true,
          visible: true,
          name: 'name',
          exportId: 'ID',
          noHandle: true,
          fixed: true,
          format: {
            type: 'Getter',
            getter: row => {
              return row.name;
            },
          },
        },
      ],
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },

      total: 10,
      rows: [],
    };
  },
  mounted() {
    this.fetResults();
  },
  methods: {
    async fetResults(payload) {
      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 10 },
        filters: [],
      };

      this.lastUsedFilters = filters;
      const data = await fetchData(this.orderBy, pagination, filters);

      this.total = data.total;
      this.rows = data.data;
    },
  },
};
</script>

<style lang="scss" scoped></style>
