<template>
  <div>{{ row.toPartner }} - {{ row.toCustAccount }}</div>
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

<style lang="scss" scoped></style>
