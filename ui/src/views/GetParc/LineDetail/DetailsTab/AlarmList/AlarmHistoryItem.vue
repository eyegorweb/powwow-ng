<template>
  <div>
    <h6>{{ item.monthName }}</h6>
    <div :key="'hist_item_' + elem.id" v-for="elem in item.items">
      {{ elem.emissionDate }} -
      <span v-if="observedStatus">{{ $t('alarms.label.newStatus') }} {{ getNewStatus(elem) }}</span>
      <span v-if="isOperatorChange">{{ $t('alarms.label.newOperator') }} {{ elem.toStatus }}</span>
      <span v-if="getNewIMEI(elem)">{{ $t('alarms.label.newImei') }} {{ getNewIMEI(elem) }}</span>
      <span v-if="isChangeCountry">{{ $t('alarms.COUNTRY_CHANGE') }}</span>
      <span v-if="isStreamAlarm(elem)"> {{ elem.streamLabel }} -</span>
      <Thresholds v-if="isConsoAlarm" :alarm="getConsoValues(elem)" />
    </div>
  </div>
</template>

<script>
import Thresholds from '@/components/Thresholds';
import { alarmStatuses } from '@/utils/alarms';
// import get from 'lodash.get';

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
    getNewStatus(elem) {
      if (elem.toStatus) {
        return this.$t('getparc.actLines.commercialStatuses.' + elem.toStatus);
      }
      return this.$t('undefined');
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
    isStreamAlarm(elem) {
      return this.isConsoAlarm && elem.streamLabel;
    },
  },

  computed: {
    isConsoAlarm() {
      return [
        'OVER_CONSUMPTION_VOLUME',
        'UNDER_CONSUMPTION_VOLUME',
        'STREAM_OVER_CONSUMPTION_VOLUME',
      ].includes(this.alarm.type);
    },
    observedStatus() {
      if (this.alarm.type !== 'STATUS_CHANGE') return;
      const status = alarmStatuses.find((s) =>
        this.alarm.triggerCommercialStatus
          ? s.id === this.alarm.triggerCommercialStatus
          : s.id === 'ALL'
      );
      return status.label;
    },

    isChangeCountry() {
      return this.alarm.type === 'COUNTRY_CHANGE';
    },
    isOperatorChange() {
      return this.alarm.type === 'PLMN_CHANGE';
    },
  },
};
</script>

<style lang="scss" scoped></style>
