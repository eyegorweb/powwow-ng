<template>
  <DataTable
    :columns="columns"
    :rows="rows || []"
    :page.sync="currentPage"
    :page-limit.sync="currentPageLimit"
    :total="total || 0"
    :order-by.sync="currentOrderBy"
    :show-extra-columns.sync="showExtraCells"
    :size="size"
    @colEvent="$emit('colEvent', $event)"
  >
    <template slot="topLeftCorner">
      <slot name="topLeftCorner"></slot>
    </template>
    <template slot="actions" slot-scope="{ row }">
      <slot name="actions" :row="row"></slot>
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';

export default {
  components: {
    DataTable,
  },
  props: {
    columns: Array,
    rows: Array,
    size: {
      type: Number,
      default: 7,
    },
    total: {
      type: Number,
      default: 0,
    },
    orderBy: Object,
    page: Number,
    pageLimit: Number,
  },

  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(newPage) {
        this.$emit('update:page', newPage);
      },
    },
    currentPageLimit: {
      get() {
        return this.pageLimit;
      },
      set(pageLimit) {
        this.$emit('update:pageLimit', pageLimit);
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
  },

  data() {
    return {
      showExtraCells: false,
    };
  },
};
</script>

<style lang="scss" scoped></style>
