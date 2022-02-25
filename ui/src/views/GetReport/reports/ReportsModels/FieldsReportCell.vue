<template>
  <div>
    <div class="massactions-ids d-flex flex-wrap justify-content-start align-items-center truncate">
      <TruncateWithTooltip :limit="30" :content="items"></TruncateWithTooltip>
    </div>
  </div>
</template>

<script>
import TruncateWithTooltip from '@/components/ui/TruncateWithTooltip';

export default {
  components: {
    TruncateWithTooltip,
  },
  props: {
    row: Object,
  },
  computed: {
    items() {
      return this.$loGet(this.row, 'fields');
    },
  },
};
</script>

<style scoped>
.truncate {
  max-width: 10rem;
}
</style>
