<template>
  <div>
    <TableWithFilterSkeleton v-if="isLoading" :columns="columns" />
    <div class="row" :class="{ hidden: isLoading }">
      <div class="col-md-3 pl-0">
        <FilterBar
          :filter-components="filters"
          @applyFilters="doSearch"
          @noMoreFilters="onAllFiltersCleared"
        />
      </div>
      <div class="col-md-9">
        <div class="row mb-3">
          <div class="col">
            <h2 class="text-gray font-weight-light" style="font-size: 2rem">
              <slot name="title"></slot>
            </h2>
          </div>
          <div class="col">
            <slot name="topRight"></slot>
          </div>
        </div>
        <ResultDataTable
          :columns="columns"
          :rows="rows"
          :total="total"
          :page.sync="page"
          :page-limit.sync="pageLimit"
          :order-by.sync="currentOrderBy"
          :size="size"
          @colEvent="$emit('colEvent', $event)"
        >
          <div slot="topLeftCorner">
            <slot name="topLeft"></slot>
          </div>
          <div slot="actions" slot-scope="{ row }">
            <slot name="actions" :row="row"></slot>
          </div>
        </ResultDataTable>

        <slot name="after"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import FilterBar from './FilterBar';
import ResultDataTable from './ResultDataTable';
import TableWithFilterSkeleton from './TableWithFilterSkeleton';

export default {
  components: {
    FilterBar,
    ResultDataTable,
    TableWithFilterSkeleton,
  },

  props: {
    filters: Array,
    columns: Array,
    rows: Array,
    total: Number,
    orderBy: Object,
    isLoading: Boolean,
    size: {
      type: Number,
      default: 7,
    },
  },

  data() {
    return {
      lastSelectedFilters: [],
      page: 1,
      pageLimit: 10,
    };
  },

  computed: {
    currentOrderBy: {
      get() {
        return this.orderBy;
      },
      set(orderBy) {
        this.$emit('update:orderBy', orderBy);
      },
    },

    pageInfo() {
      return {
        page: this.page - 1,
        limit: this.pageLimit,
      };
    },
  },

  watch: {
    page() {
      this.refreshTable(this.lastSelectedFilters, this.currentOrderBy);
    },

    orderBy(orderBy) {
      this.page = 1;
      this.refreshTable(this.lastSelectedFilters, orderBy);
    },
    pageLimit() {
      this.page = 1;
      this.refreshTable(this.lastSelectedFilters, this.currentOrderBy);
    },
  },

  methods: {
    onAllFiltersCleared() {
      this.lastSelectedFilters = [];
      this.refreshTable([], this.currentOrderBy);
    },
    refreshTable(filters, orderBy) {
      this.$emit('applyFilters', {
        orderBy,
        filters,
        pagination: this.pageInfo,
      });
    },
    doSearch(selectedFilters) {
      this.lastSelectedFilters = selectedFilters;
      this.page = 1;
      this.refreshTable(selectedFilters, this.currentOrderBy);
    },
  },
};
</script>

<style lang="scss" scoped>
.hidden {
  display: none;
}
</style>
