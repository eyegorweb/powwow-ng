<template>
  <div>
    <div v-if="!rows || !rows.length" class="alert alert-light" role="alert">
      {{ $t('noResult') }}
    </div>
    <DataTable
      v-else
      :columns.sync="columns"
      :rows="rows || []"
      :page.sync="page"
      :total="total || 0"
      :order-by.sync="orderBy"
      :page-limit.sync="pageLimit"
      :size="6"
      :show-extra-columns.sync="showExtraCells"
    />
  </div>
</template>

<script>
/**
 * DEPRECATED Use PaginatedDataTable instead
 */
import DataTable from '@/components/DataTable/DataTable';

export default {
  props: {
    columns: Array,
    fetchDataFn: Function,
  },
  components: {
    DataTable,
  },
  watch: {
    page() {
      this.refreshTable();
    },
    orderBy() {
      this.page = 1;
      this.refreshTable();
    },
    pageLimit() {
      this.page = 1;
      this.refreshTable();
    },
  },
  mounted() {
    this.refreshTable();
  },
  computed: {
    pageInfo() {
      return { page: this.page - 1, limit: this.pageLimit };
    },
  },
  methods: {
    async refreshTable() {
      const response = await this.fetchDataFn(this.pageInfo);
      this.rows = response.rows;
      this.total = response.total;
    },
  },
  data() {
    return {
      showExtraCells: false,
      orderBy: {
        key: 'date',
        direction: 'DESC',
      },
      rows: undefined,
      page: 1,
      pageLimit: 20,
      total: 0,
    };
  },
};
</script>

<style lang="scss" scoped></style>
