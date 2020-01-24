<template>
  <div v-if="shouldTruncate" class="truncate">
    <Truncate v-if="row.location" :limit="30" :content="locationDetails"></Truncate>
  </div>
  <div v-else>{{ locationDetails }}</div>
</template>

<script>
import Truncate from '@/components/ui/Truncate';

const MAX_SIZE_BEFORE_TRUNCATE = 4;

export default {
  name: 'LocationCell',
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
    locationDetails() {
      return this.row.location.detail ? this.row.location.detail : '-';
    },
  },
};
</script>

<style scoped>
.truncate {
  max-width: 10rem;
}
</style>
