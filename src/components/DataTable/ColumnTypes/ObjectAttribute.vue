<template>
  <div>
    {{ value }}
  </div>
</template>

<script>
import _get from 'lodash.get';

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
      return _get(this.item, this.format.path);
    },
  },
};
</script>

<style scoped>
</style>
