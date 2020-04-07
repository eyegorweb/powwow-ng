<template>
  <div>
    <div v-if="isConsoAlarm" class="overview-item mr-5">
      <h6>{{ $t('getvsion.table.thresholds') }}:</h6>
      <Thresholds :alarm="alarm" />
    </div>

    <div v-if="observedStatus" class="overview-item mr-5">
      <h6>{{ $t('alarms.STATUS_CHANGE') }}:</h6>
      {{ observedStatus }}
    </div>
  </div>
</template>

<script>
import Thresholds from '@/components/Thresholds';
import { alarmStatuses } from '@/utils/alarmConsts';

export default {
  components: {
    Thresholds,
  },
  props: {
    alarm: Object,
  },

  computed: {
    isConsoAlarm() {
      return ['OVER_CONSUMPTION_VOLUME', 'UNDER_CONSUMPTION_VOLUME'].includes(this.alarm.type);
    },
    observedStatus() {
      if (this.alarm.type !== 'STATUS_CHANGE') return;

      const status = alarmStatuses.find(s => s.id === this.alarm.triggerCommercialStatus);
      return status.label;
    },
  },
};
</script>

<style lang="scss" scoped></style>
