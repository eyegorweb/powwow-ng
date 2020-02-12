<template>
  <div>
    <span class="text-success">{{ success }} / </span>
    <span class="text-danger">{{ fail }}</span>
  </div>
</template>

<script>
export default {
  name: 'RateCell',
  props: {
    row: Object,
  },
  computed: {
    success() {
      return `${this.row.completedEntitiesNumber} ${this.$t(
        'getparc.history.col.success'
      )}`.toLocaleLowerCase();
    },
    fail() {
      return `${this.row.failedEntitiesNumber} ${this.$t(
        'getparc.history.col.fail'
      )}`.toLocaleLowerCase();
    },
  },
};
</script>

<style scoped>
.truncate {
  max-width: 10rem;
}
</style>
