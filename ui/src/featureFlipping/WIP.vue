<template>
  <div>
    <slot v-if="show" />
  </div>
</template>

<script>
/**
 * Work in progress
 */
import { shouldFilterMocked } from './plugin';

export default {
  data() {
    return {
      show: true,
    };
  },
  mounted() {
    this.show = !shouldFilterMocked();
  },
};
</script>

<style lang="scss" scoped></style>
