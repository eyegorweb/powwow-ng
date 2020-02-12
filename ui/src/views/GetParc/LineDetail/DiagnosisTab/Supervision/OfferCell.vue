<template>
  <div v-if="shouldTruncate" class="truncate">
    <Truncate v-if="row.pdpConnectionHistory" :limit="30" :content="offerDetails"></Truncate>
  </div>
  <div v-else>{{ offerDetails }}</div>
</template>

<script>
import Truncate from '@/components/ui/Truncate';

const MAX_SIZE_BEFORE_TRUNCATE = 4;

export default {
  name: 'OfferCell',
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
    offerDetails() {
      return this.row.pdpConnectionHistory.offerCode
        ? this.row.pdpConnectionHistory.offerCode
        : '-';
    },
  },
};
</script>

<style scoped>
.truncate {
  max-width: 10rem;
}
</style>
