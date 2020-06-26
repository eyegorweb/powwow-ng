<template>
  <LoaderContainer :is-loading="isLoading">
    <div slot="on-loading">
      <TableSkeleton :columns="columns" :size="3" />
    </div>
    <div v-if="isError" class="alert alert-light" role="alert">{{ $t('requestError') }}</div>
    <DataTable
      v-if="!isError && orderBy"
      :columns.sync="columns"
      :rows="rows || []"
      :page.sync="page"
      :total="total || 0"
      :order-by.sync="orderBy"
      :page-limit.sync="pageLimit"
      :size="size"
      :show-extra-columns.sync="showExtraCells"
      @colEvent="$emit('colEvent', $event)"
    >
      <template slot="topLeftCorner">
        <slot name="topLeftCorner" />
      </template>
      <template slot="noResult">
        <slot name="noResult" />
      </template>
    </DataTable>
  </LoaderContainer>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import LoaderContainer from '@/components/LoaderContainer';
import TableSkeleton from '@/components/ui/skeletons/TableSkeleton';

export default {
  props: {
    columns: Array,
    fetchDataFn: Function,
    size: {
      type: Number,
      default: 6,
    },
    additionalFilters: {
      type: Array,
      default: () => {
        return [];
      },
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
    TableSkeleton,
    LoaderContainer,
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
    additionalFilters() {
      if (!this.ready) return;
      this.page = 1;
      this.refreshTable();
    },
  },
  mounted() {
    this.orderBy = { ...this.order };
    this.refreshTable();
    setTimeout(() => {
      this.ready = true;
    });
  },
  computed: {
    pageInfo() {
      return { page: this.page - 1, limit: this.pageLimit };
    },
  },
  methods: {
    async refreshTable() {
      this.isLoading = true;
      this.isError = false;
      try {
        const response = await this.fetchDataFn(
          this.pageInfo,
          this.orderBy,
          this.additionalFilters
        );

        this.isLoading = false;
        this.rows = response.rows;
        this.total = response.total;
      } catch (e) {
        this.isLoading = false;
        this.isError = true;
        console.error(e);
      }
    },
  },
  data() {
    return {
      isLoading: false,
      isError: false,
      showExtraCells: false,
      orderBy: undefined,
      rows: undefined,
      page: 1,
      pageLimit: 20,
      total: 0,
      ready: false,
    };
  },
};
</script>

<style lang="scss" scoped></style>
