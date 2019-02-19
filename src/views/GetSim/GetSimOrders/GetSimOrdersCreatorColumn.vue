<template>
  <span>
    {{ row.auditable.creator.name.firstName }} {{ row.auditable.creator.name.lastName }}
  </span>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
    },
  },
};
</script>

<style scoped>
</style>
