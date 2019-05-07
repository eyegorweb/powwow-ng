<template>
  <a href="#" @click.prevent="format.onClick(item, row)">{{ item }}</a>
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
