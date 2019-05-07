<template>
  <div>
    {{ formattedDate }}
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
      return this.item && this.item.replace(/-/g, '/').split(' ')[0];
    },
  },
};
</script>

<style scoped></style>
