<template>
  <div>{{ row.fromPartner }} - {{ row.fromCustAccount }}</div>
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
