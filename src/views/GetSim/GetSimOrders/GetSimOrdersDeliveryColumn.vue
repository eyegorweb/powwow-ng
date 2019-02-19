<template>
  <a :href="`mailto:${row.contactInformation.email}`">
    {{ row.name.firstName }} {{ row.name.lastName }}
  </a>
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
