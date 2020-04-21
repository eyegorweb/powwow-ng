<template>
  <Truncate v-if="content" :limit="limit" :content="content"></Truncate>
</template>

<script>
import Truncate from '@/components/ui/Truncate';

export default {
  components: {
    Truncate,
  },
  props: {
    /**
     * Shape of formatting object
     * format: {
     *  type: 'Truncated',
     *  limit: 30,
     *  getter: Function
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
    content() {
      return this.format.getter ? this.format.getter(this.row) : '';
    },
    limit() {
      return this.format ? this.format.limit : 30;
    },
  },
};
</script>

<style scoped></style>
