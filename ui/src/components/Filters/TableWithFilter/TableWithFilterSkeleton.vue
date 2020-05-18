<template>
  <div class="row">
    <div class="col-md-3 pl-0">
      <div class="bordered bg-white p-3">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>
    </div>
    <div class="col-md-9">
      <div class="row mb-3">
        <div class="col">
          <div class="skeleton-line"></div>
        </div>
        <div class="col">
          <div class="skeleton-line"></div>
        </div>
      </div>
      <TableSkeleton :columns="columns" :size="3" />
    </div>
  </div>
</template>

<script>
import TableSkeleton from '@/components/ui/skeletons/TableSkeleton';

export default {
  components: {
    TableSkeleton,
  },
  props: {
    columns: Array,
  },
};
</script>

<style lang="scss" scoped></style>
