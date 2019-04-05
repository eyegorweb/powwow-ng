<template>
  <div v-if="row.customerAccount">
    {{ row.customerAccount.code }} - {{ row.customerAccount.name }}
  </div>
</template>

<script>
export default {
  props: {
    row: Object,
  },
};
</script>

<style scoped></style>
