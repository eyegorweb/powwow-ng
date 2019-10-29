<template>
  <div class="truncate">
    <Truncate :limit="30" :content="row.type"></Truncate>
  </div>
</template>

<script>
import Truncate from '@/components/ui/Truncate';

export default {
  name: 'ActionCell',
  props: {
    row: Object,
  },
  components: {
    Truncate,
  },
};
</script>

<style scoped>
.truncate {
  max-width: 10rem;
}
</style>
