<template>
  <div>
    {{ value }}
  </div>
</template>

<script>
import { get } from 'lodash-es';

export default {
  props: {
    /**
     * Shape of formatting object
     * format: {
     *  type: 'ObjectAttribute',
     *  path: 'path.to.attribute'
     * }
     */
    format: {
      type: Object,
      required: true,
    },
    item: {
      type: [Object, Array],
    },
  },
  computed: {
    value() {
      return get(this.item, this.format.path);
    },
  },
};
</script>

<style scoped>
</style>
