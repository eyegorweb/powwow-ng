<template>
  <a href="#" @click.prevent="format.onClick(item)">{{ item }}</a>
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
  },
};
</script>

<style scoped>
</style>
