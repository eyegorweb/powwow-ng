<template>
  <div>{{ value }}</div>
</template>

<script>
export default {
  props: {
    /**
     * Shape of formatting object
     * format: {
     *  type: 'Getter',
     *  getter: getterFn
     * }
     */
    format: {
      type: Object,
      required: true,
    },
    row: {
      type: [Object, Array],
    },
  },
  computed: {
    value() {
      return this.format.getter(this.row);
    },
  },
};
</script>

<style scoped></style>
