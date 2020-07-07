<template>
  <div v-if="get('accessPoint.id')" class="overview-container m-3 bg-white">
    <div class="overview-item">
      <h4 class="font-weight-normal text-uppercase">
        {{ $t('getparc.actLines.details.alarmsInfo') }}
      </h4>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actLines.col.positionedAlarms') }} :</h6>
      <p v-for="alarm in positionedAlarms" :key="'alarm_' + alarm.id">
        {{ $t('getparc.lineDetail.alarms.ALARM_TYPE.' + alarm.type) }}
      </p>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actLines.col.triggeredAlarms') }} :</h6>
      <p v-for="alarm in triggeredAlarms" :key="'triggered_alarm_' + alarm.type">
        {{
          `${$t('getparc.lineDetail.alarms.ALARM_TYPE.' + alarm.alarm.type)} - ${
            alarm.alarm.startDate
          }`
        }}
      </p>
    </div>
  </div>
  <div v-else></div>
</template>

<script>
import get from 'lodash.get';
import { fetchAlarmsWithInfos } from '@/api/alarms';

export default {
  data() {
    return {
      triggeredAlarms: [],
    };
  },
  props: {
    content: {
      type: Object,
    },
  },

  async mounted() {
    if (!this.content.id) return;
    this.triggeredAlarms = await fetchAlarmsWithInfos(this.content.id);
  },

  methods: {
    get(path, defaultVal = '') {
      return get(this.content, path, defaultVal);
    },
  },
  computed: {
    positionedAlarms() {
      return this.get('accessPoint.alarmInstance');
    },
  },
};
</script>

<style lang="scss" scoped></style>
