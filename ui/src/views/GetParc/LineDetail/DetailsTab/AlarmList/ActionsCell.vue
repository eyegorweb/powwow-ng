<template>
  <div>
    <button v-if="row.isActive" class="btn btn-link p-0">
      {{ $t('getparc.lineDetail.alarms.disableLine') }}
    </button>
    <button v-else class="btn btn-link p-0">
      {{ $t('getparc.lineDetail.alarms.enableLine') }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    row: Object,
  },
};
</script>

<style lang="scss" scoped>
button {
  text-align: inherit;
  font-weight: 600;
}
</style>
