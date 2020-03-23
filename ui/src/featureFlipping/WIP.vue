<template>
  <Fragment>
    <slot v-if="show" />
    <slot v-else name="orelse"></slot>
  </Fragment>
</template>

<script>
/**
 * Work in progress
 */
import { shouldFilterMocked } from './plugin';
import { Fragment } from 'vue-fragment';

export default {
  components: {
    Fragment,
  },
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
