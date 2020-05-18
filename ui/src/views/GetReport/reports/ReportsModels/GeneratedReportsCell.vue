<template>
  <div>
    <button class="btn btn-link btn-select p-0" @click.stop="onClick">
      {{ row.generatedReports || 0 }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    row: Object,
  },
  methods: {
    onClick() {
      this.$router.push({ name: 'documents', params: { reportId: this.row.id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-select {
  user-select: initial;
}
</style>
