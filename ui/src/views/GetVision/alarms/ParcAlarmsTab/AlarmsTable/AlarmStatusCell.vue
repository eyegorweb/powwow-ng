<template>
  <div>
    <div>{{ $t('getvsion.alarm.statuses.' + status) }}</div>
    <div class="subtitle">{{ dateToShow }}</div>
  </div>
</template>

<script>
export default {
  props: {
    row: Object,
  },
  computed: {
    dateToShow() {
      if (this.row.disabled) {
        if (this.row.auditable.updated) return this.row.auditable.updated;

        return this.row.auditable.created;
      } else {
        if (!this.row.startDate) {
          return this.row.auditable.created;
        } else {
          return this.row.startDate;
        }
      }
    },
    status() {
      // Note : svp ne mettez pas d'expressions ternaires ici, on veux garder ce bout de code lisible autant que possible.

      if (this.row.disabled) {
        return 'disabled';
      } else {
        if (!this.row.startDate) {
          return 'created';
        } else {
          return 'activated';
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.subtitle {
  font-size: 0.8rem;
  color: $gray-680;
}
</style>
