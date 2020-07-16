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

  mounted() {
    console.log(this.row);
  },
};
</script>

<style lang="scss" scoped></style>
