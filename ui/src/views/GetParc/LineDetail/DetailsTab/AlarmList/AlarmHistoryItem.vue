<template>
  <div>
    <h6>{{ item.monthName }}</h6>
    <div :key="'hist_item_' + elem.id" v-for="elem in item.items">
      {{ elem.emissionDate }}
      <span v-if="observedStatus">Nouveau Statut : {{ item.toStatus }}</span>
      <span v-if="getNewIMEI(elem)">Nouvel IMEI : {{ getNewIMEI(elem) }}</span>
      <span v-if="isChangeCountry">{{ $t('alarms.COUNTRY_CHANGE') }}</span>
      <Thresholds v-if="isConsoAlarm" :alarm="getConsoValues(elem)" />
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
    item: Object,
    alarm: Object,
  },

  methods: {
    getNewIMEI(elem) {
      if (this.alarm.type !== 'IMEI_CHANGE') return;
      return elem.newIMEI;
    },

    getConsoValues(elem) {
      return {
        level1: elem.currentValue1,
        level1Up: elem.currentValue1Up,
        level1Down: elem.currentValue1Down,
        level2: elem.currentValue2,
        level2Up: elem.currentValue2Up,
        level2Down: elem.currentValue2Down,
        level3: elem.currentValue3,
        level3Up: elem.currentValue3Up,
        level3Down: elem.currentValue3Down,
      };
    },
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
  },
};
</script>

<style lang="scss" scoped></style>
