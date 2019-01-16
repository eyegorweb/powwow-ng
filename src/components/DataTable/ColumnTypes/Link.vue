<template>
  <router-link :to="format.getUrl(item)">{{ item }}</router-link>
</template>

<script>
export default {
  props: {
    /**
     * Shape of formatting object
     * format: {
     *  type: 'Link',
     *  getUrl(item)
     * }
     */
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
