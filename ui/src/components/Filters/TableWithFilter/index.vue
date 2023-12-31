<template>
  <div>
    <TableWithFilterSkeleton v-if="isLoading" :columns="columns" />
    <div class="row" :class="{ hidden: isLoading }">
      <div class="col-md-3 pl-0">
        <slot name="before-filters" />
        <FilterBar
          :filter-components="filters"
          :default-values="defaultValues"
          :storage-version="storageVersion"
          :storage-id="storageId"
          @applyFilters="doSearch"
          @noMoreFilters="onAllFiltersCleared"
          @currentFiltersChange="$emit('currentFiltersChange', $event)"
        >
          <template #beforeSelectedFilters>
            <slot name="beforeSelectedFilters"></slot>
          </template>
          <template #actions="{ onSearch }">
            <div class="actions d-flex flex-column flex-md-row mb-2">
              <UiButton
                variant="primary"
                :disabled="isSearchDisabled"
                @click="onSearch"
                class="apply-filters-btn flex-grow-1 py-1 px-3 ml-1"
                >{{ $t('applyFilters') }}</UiButton
              >
            </div>
          </template>
        </FilterBar>
      </div>
      <div class="col-md-9">
        <slot name="before-table" />

        <template
          v-if="!isTableVisibleFn || (isTableVisibleFn && isTableVisibleFn(lastSelectedFilters))"
        >
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
          <TableSkeleton v-if="isTableLoading" :columns="columns" :size="10" />
          <ResultDataTable
            v-else
            :columns="columns"
            :storage-version="storageVersion"
            :storage-id="storageId"
            :rows="rows"
            :total="total"
            :page.sync="pageParam"
            :page-limit.sync="pageLimit"
            :order-by.sync="currentOrderBy"
            :size="size"
            @colEvent="$emit('colEvent', $event)"
            @columnOrdered="$emit('columnOrdered', $event)"
          >
            <div slot="topLeftCorner">
              <slot name="topLeft"></slot>
            </div>
            <div slot="actions" slot-scope="{ row }">
              <slot name="actions" :row="row"></slot>
            </div>
            <div slot="noResult">
              <div v-if="showReset">
                <button class="btn btn-link" @click="$emit('resetSearch')">
                  {{ $t('resetFilters') }}
                </button>
              </div>
              <div class="alert alert-light">{{ $t('noResult') }}</div>
            </div>
          </ResultDataTable>

          <slot name="after"></slot>
        </template>
        <slot
          v-if="isTableVisibleFn && !isTableVisibleFn(lastSelectedFilters)"
          name="onTableNotVisible"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FilterBar from './FilterBar';
import ResultDataTable from './ResultDataTable';
import TableWithFilterSkeleton from './TableWithFilterSkeleton';
import TableSkeleton from '@/components/ui/skeletons/TableSkeleton';
import UiButton from '@/components/ui/Button';

export default {
  components: {
    FilterBar,
    ResultDataTable,
    TableWithFilterSkeleton,
    TableSkeleton,
    UiButton,
  },

  props: {
    storageVersion: String,
    storageId: String,
    filters: Array,
    columns: Array,
    rows: Array,
    total: Number,
    orderBy: Object,
    isLoading: Boolean,
    isTableLoading: Boolean,
    noPagination: Boolean,
    showReset: Boolean,
    isSearchDisabled: Boolean,
    size: {
      type: Number,
      default: 7,
    },
    initPageLimit: {
      type: Number,
      default: 20,
    },
    isTableVisibleFn: {
      type: Function,
      required: false,
    },
    defaultValues: {
      type: Array,
      required: false,
    },
  },

  mounted() {
    if (this.initPageLimit) {
      this.pageLimit = this.initPageLimit;
    }
  },

  data() {
    return {
      lastSelectedFilters: [],
      page: 1,
      pageLimit: 20,
    };
  },

  computed: {
    pageParam: {
      get() {
        return this.noPagination ? undefined : this.page;
      },
      set(value) {
        this.page = value;
      },
    },
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
    page(newPage) {
      this.$emit('update:page', { page: newPage - 1 });
      this.refreshTable(this.lastSelectedFilters, this.currentOrderBy);
    },

    orderBy(orderBy) {
      this.page = 1;
      this.refreshTable(this.lastSelectedFilters, orderBy);
    },
    pageLimit(newLimit) {
      this.$emit('update:limit', { limit: newLimit });
      this.page = 1;
      this.refreshTable(this.lastSelectedFilters, this.currentOrderBy);
    },
  },

  methods: {
    onAllFiltersCleared() {
      this.lastSelectedFilters = [];
      this.refreshTable(this.lastSelectedFilters, this.currentOrderBy);
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
