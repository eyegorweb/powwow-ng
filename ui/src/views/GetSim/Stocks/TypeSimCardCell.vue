<template>
  <div v-if="shouldTruncate" class="truncate">
    <Truncate v-if="row" :limit="10" :content="typeDetails"></Truncate>
  </div>
  <div v-else>{{ typeDetails }}</div>
</template>

<script>
import Truncate from '@/components/ui/Truncate';

const MAX_SIZE_BEFORE_TRUNCATE = 4;

export default {
  name: 'TypeSimCardCell',
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
    typeDetails() {
      console.log('row', this.row);
      return this.row.simCardType.label ? this.row.simCardType.label : '-';
    },
  },
};
</script>

<style scoped>
.truncate {
  max-width: 10rem;
}
</style>
