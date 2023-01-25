<template>
  <span v-if="format.isClickable(item)">
    <a href="#" @click.prevent="format.onClick(item, row)">
      <template v-if="!format.getLabel">{{ item }}</template>
      <template v-else>{{ format.getLabel(item) }}</template>
    </a>
  </span>
  <span v-else>
    <template v-if="!format.getLabel">{{ item }}</template>
    <template v-else>{{ format.getLabel(item) }}</template>
  </span>
</template>

<script>
export default {
  props: {
    format: {
      type: Object,
      required: true,
    },
    item: {
      type: [String, Number],
    },
    row: Object,
  },
};
</script>

<style scoped></style>
