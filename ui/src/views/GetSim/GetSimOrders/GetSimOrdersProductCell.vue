<template>
  <div class="truncate">
    <Truncate
      v-if="row.orderedSIMCard"
      :limit="30"
      :content="row.orderedSIMCard.description"
    ></Truncate>
  </div>
</template>

<script>
import Truncate from '@/components/ui/Truncate';

export default {
  components: {
    Truncate,
  },
  props: {
    row: Object,
  },
};
</script>

<style scoped>
.truncate {
  max-width: 10rem;
}
</style>
