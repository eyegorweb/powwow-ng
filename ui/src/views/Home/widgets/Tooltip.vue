<template>
  <div>{{ content }}</div>
</template>

<script>
export default {
  name: 'Tooltip',

  props: {
    row: Object,
  },
  computed: {
    content() {
      return this.row.info && this.row.info.length > 30
        ? this.row.info.substring(0, 30) + '...'
        : this.row.info
        ? this.row.info
        : '-';
    },
  },
};
</script>

<style scoped></style>
