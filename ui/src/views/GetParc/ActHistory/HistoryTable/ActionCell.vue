<template>
  <div class="truncate">
    <Truncate :limit="30" :content="translatedAction"> </Truncate>
  </div>
</template>

<script>
import Truncate from '@/components/ui/Truncate';

export default {
  props: {
    row: Object,
  },
  components: {
    Truncate,
  },
  computed: {
    translatedAction() {
      return this.$t('getparc.actTypes.' + this.row.actionType);
    },
  },
};
</script>

<style scoped>
.truncate {
  max-width: 10rem;
}
</style>
