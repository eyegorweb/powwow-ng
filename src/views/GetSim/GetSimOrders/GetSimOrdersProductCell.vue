<template>
  <div class="truncate">
    <Truncate :limit="2" :content="row.orderedSimcard.description"></Truncate>
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
