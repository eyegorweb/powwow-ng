<template>
  <button class="btn btn-link btn-select p-0" @click.stop="openPanel">
    {{ row.iccid }}
  </button>
</template>

<script>
export default {
  name: 'IdCell',
  props: {
    row: Object, // line
  },
  methods: {
    openPanel() {
      this.$emit('colEvent', { action: 'openAlarmPanel', row: this.row });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-select {
  user-select: initial;
}
</style>
