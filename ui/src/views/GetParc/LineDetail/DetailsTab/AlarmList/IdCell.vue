<template>
  <button class="btn btn-link p-0" @click.stop="openPanel">
    {{ row.alarm.id }}
  </button>
</template>

<script>
export default {
  name: 'IdCell',
  props: {
    row: Object,
  },
  methods: {
    openPanel() {
      this.$emit('colEvent', { action: 'openAlarmPanel', row: this.row });
    },
  },
};
</script>

<style lang="scss" scoped></style>
