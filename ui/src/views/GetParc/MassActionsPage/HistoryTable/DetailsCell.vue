<template>
  <div v-if="shouldTruncate" class="truncate">
    <Truncate v-if="row.info" :limit="30" :content="details"></Truncate>
  </div>
  <div v-else>{{ details }}</div>
</template>

<script>
import Truncate from '@/components/ui/Truncate';

const MAX_SIZE_BEFORE_TRUNCATE = 4;

export default {
  name: 'DetailsCell',
  components: {
    Truncate,
  },
  props: {
    row: Object,
    visibleColumns: Array,
  },
  computed: {
    shouldTruncate() {
      return this.visibleColumns.length > MAX_SIZE_BEFORE_TRUNCATE;
    },
    details() {
      return this.row.info ? this.row.info : '-';
    },
  },
};
</script>

<style scoped>
.truncate {
  max-width: 10rem;
}
</style>
