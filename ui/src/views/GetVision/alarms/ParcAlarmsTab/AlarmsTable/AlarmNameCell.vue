<template>
  <div>
    <div>{{ row.name }}</div>
    <div class="subtitle">{{ $t('getparc.lineDetail.alarms.ALARM_TYPE.' + row.type) }}</div>
  </div>
</template>

<script>
export default {
  name: 'AlarmNameCell',
  props: {
    row: Object,
  },
};
</script>

<style lang="scss" scoped>
.subtitle {
  font-size: 0.8rem;
  color: $gray-680;
}
</style>
