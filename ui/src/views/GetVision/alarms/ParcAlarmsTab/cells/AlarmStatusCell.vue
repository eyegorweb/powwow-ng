<template>
  <div>
    <div>{{ $t('getvsion.alarm.statuses.' + status) }}</div>
    <div class="subtitle">{{ dateToShow }}</div>
  </div>
</template>

<script>
export default {
  name: 'AlarmStatusCell',
  props: {
    row: Object,
  },
  computed: {
    dateToShow() {
      if (this.$loGet(this.row, 'disabled')) {
        if (this.$loGet(this.row, 'auditable.updated'))
          return this.$loGet(this.row, 'auditable.updated');

        return this.$loGet(this.row, 'auditable.created');
      } else {
        if (!this.$loGet(this.row, 'startDate')) {
          return this.$loGet(this.row, 'auditable.created');
        } else {
          return this.$loGet(this.row, 'startDate');
        }
      }
    },
    status() {
      // Note : svp ne mettez pas d'expressions ternaires ici, on veux garder ce bout de code lisible autant que possible.

      if (this.$loGet(this.row, 'disabled')) {
        return 'disabled';
      } else {
        if (!this.$loGet(this.row, 'startDate')) {
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
