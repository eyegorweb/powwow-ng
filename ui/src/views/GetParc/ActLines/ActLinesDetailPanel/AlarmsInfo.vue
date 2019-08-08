<template>
  <div class="overview-container m-3 bg-white">
    <div class="overview-item">
      <h4 class="font-weight-normal text-uppercase">
        {{ $t('getparc.actLines.details.alarmsInfo') }}
      </h4>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actLines.col.positionedAlarms') }} :</h6>
      <p v-for="alarm in positionedAlarms" :key="alarm.type">{{ alarm.type }}</p>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actLines.col.triggeredAlarms') }} :</h6>
      <p v-for="alarm in triggeredAlarms" :key="alarm.type">
        {{ `${alarm.type} ' - ' ${emissionDate}` }}
      </p>
    </div>
  </div>
</template>

<script>
import get from 'lodash.get';
import { getAlarmEvents } from '@/api/alarms';

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
    let fiter = {
      searchBy: 'ACCESSPOINT_ID',
      id: this.get('accessPoint.id'),
    };
    this.triggeredAlarms = await getAlarmEvents(fiter);
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
