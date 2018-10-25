<template>
  <div>
    <input
      type="text"
      v-model="$value"
    >
    <div>
      <slot
        :results="results"
        :query="$value"
      />
    </div>
  </div>
</template>

<script>
import { propWithDataFallback } from 'vue-prop-data-fallback';

export default {
  // accepte une prop value mais peut marcher sans
  mixins: [propWithDataFallback('value')],

  props: {
    items: {
      type: Array,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
  },

  computed: {
    results() {
      return this.$value
        ? this.items.filter(item => this.fields.some(field => item[field].includes(this.$value)))
        : this.items;
    },
  },
};
</script>

<style scoped>
</style>
