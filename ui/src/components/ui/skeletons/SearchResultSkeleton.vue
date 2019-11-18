<template>
  <div>
    <div class="row mb-3">
      <div class="col-md-6">
        <h2 class="text-gray font-weight-light" style="font-size: 2rem">
          <div class="skeleton-line"></div>
        </h2>
      </div>
    </div>
    <div class="row mb-4">
      <div class="col">
        <h2 class="text-gray font-weight-light" style="font-size: 2rem">
          <div class="skeleton-line"></div>
        </h2>
      </div>

      <div class="col">
        <h2 class="text-gray font-weight-light" style="font-size: 2rem">
          <div class="skeleton-line"></div>
        </h2>
      </div>
    </div>
    <TableSkeleton :columns="columns" />
  </div>
</template>

<script>
import TableSkeleton from './TableSkeleton';

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
