<template>
  <div v-if="shouldTruncate" class="truncate">
    <Truncate
      v-if="row.orderedSIMCard"
      :limit="30"
      :content="row.orderedSIMCard.description"
    ></Truncate>
  </div>
  <div v-else>{{ row.orderedSIMCard.description }}</div>
</template>

<script>
import Truncate from '@/components/ui/Truncate';

const MAX_SIZE_BEFORE_TRUNCATE = 4;

export default {
  name: 'GetSimOrdersProductCell',
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
  },
};
</script>

<style scoped>
.truncate {
  max-width: 10rem;
}
</style>
