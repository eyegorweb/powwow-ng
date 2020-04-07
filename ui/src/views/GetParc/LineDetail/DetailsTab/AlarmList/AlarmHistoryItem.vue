<template>
  <div>
    <h6>{{ item.monthName }}</h6>
    <p>
      {{ item.emissionDate }}
      <span v-if="observedStatus">Nouveau Statut : {{ item.toStatus }}</span>
      <span v-if="newIMEI">Nouvel IMEI : {{ newIMEI }}</span>
      <span v-if="isChangeCountry">{{ $t('alarms.COUNTRY_CHANGE') }}</span>
      <Thresholds v-if="isConsoAlarm" :alarm="item.alarm" />
    </p>
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
    item: Object,
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

    isChangeCountry() {
      return this.alarm.type === 'COUNTRY_CHANGE';
    },

    newIMEI() {
      if (this.alarm.type !== 'IMEI_CHANGE') return;
      return this.item.newIMEI;
    },
  },
};
</script>

<style lang="scss" scoped></style>
