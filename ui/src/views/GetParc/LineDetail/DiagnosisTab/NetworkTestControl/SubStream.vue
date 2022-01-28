<template>
  <div>
    {{ row.stream }}
  </div>
</template>

<script>
export default {
  props: {
    row: Object,
  },

  mounted() {
    console.log(this.row);
  },
};
</script>

<style lang="scss" scoped></style>
