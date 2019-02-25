<template>
  <div>
    <a v-if="row.contactInformation && row.name" :href="`mailto:${row.contactInformation.email}`">
      {{ row.name.firstName }} {{ row.name.lastName }}
    </a>
  </div>

</template>

<script>
export default {
  props: {
    row: Object,
  },
};
</script>

<style scoped>
</style>
