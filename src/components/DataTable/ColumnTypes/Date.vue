<template>
  <div>
    <p>{{ formattedDate }}</p>
  </div>
</template>

<script>
export default {
  props: {
    format: {
      type: Object,
      required: true,
    },
    item: {
      type: String,
    },
  },
  computed: {
    formattedDate() {
      return this.item.replace(/-/g, '/');
    },
  },
};
</script>

<style scoped>
</style>
