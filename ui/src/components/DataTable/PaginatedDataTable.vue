<template>
  <div>
    <button class="modal-default-button btn btn-light btn-sm ml-1" disabled v-if="isLoading">
      {{ $t('loading') }}
      <CircleLoader />
    </button>
    <template v-else>
      <DataTable
        :columns.sync="columns"
        :rows="rows || []"
        :page.sync="page"
        :total="total || 0"
        :order-by.sync="orderBy"
        :page-limit.sync="pageLimit"
        :size="size"
        :show-extra-columns.sync="showExtraCells"
        @colEvent="$emit('colEvent', $event)"
      />
    </template>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import CircleLoader from '@/components/ui/CircleLoader';

export default {
  props: {
    columns: Array,
    fetchDataFn: Function,
    size: {
      type: Number,
      default: 6,
    },
    order: {
      type: Object,
      default: () => {
        return {
          key: 'date',
          direction: 'DESC',
        };
      },
    },
  },
  components: {
    DataTable,
    CircleLoader,
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
    this.orderBy = this.order;
    this.refreshTable();
  },
  computed: {
    pageInfo() {
      return { page: this.page - 1, limit: this.pageLimit };
    },
  },
  methods: {
    async refreshTable() {
      this.isLoading = true;
      const response = await this.fetchDataFn(this.pageInfo, this.orderBy);
      this.isLoading = false;
      this.rows = response.rows;
      this.total = response.total;
    },
  },
  data() {
    return {
      isLoading: false,
      showExtraCells: false,
      orderBy: undefined,
      rows: undefined,
      page: 1,
      pageLimit: 20,
      total: 0,
    };
  },
};
</script>

<style lang="scss" scoped></style>
