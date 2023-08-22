<template>
  <div>
    <div v-if="accessPointID" class="overview-container m-3 bg-white">
      <div class="overview-item">
        <h4 class="font-weight-normal text-uppercase">
          {{ $t('getparc.actLines.details.alarmsInfo') }}
        </h4>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getparc.actLines.col.positionedAlarms') }} :</h6>
        <p v-for="(elem, idx) in positionedAlarms" :key="'alarm_' + idx">
          {{ $t('getparc.lineDetail.alarms.ALARM_TYPE.' + elem.type) }}
        </p>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getparc.actLines.col.triggeredAlarms') }} :</h6>
        <p v-for="(elem, idx) in triggeredAlarms" :key="'triggered_alarm_' + idx">
          <span>
            {{ `${$t('getparc.lineDetail.alarms.ALARM_TYPE.' + elem.alarm.type)}` }}
          </span>
          <span v-if="elem.triggeringDate"> - {{ elem.triggeringDate }}</span>
        </p>
        <p v-if="errorMessage" class="text-danger" role="alert">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchAlarmsWithInfos } from '@/api/alarms';
import { formatBackErrors } from '@/utils/errors';

export default {
  data() {
    return {
      triggeredAlarms: [],
      errorMessage: undefined,
    };
  },
  props: {
    content: {
      type: Object,
    },
  },

  async mounted() {
    const simCardInstanceId = this.$loGet(this.content, 'id', null);
    const response = await fetchAlarmsWithInfos(simCardInstanceId);
    if (!response) {
      return [];
    } else if (response.errors && response.errors.length) {
      const formatted = formatBackErrors(response.errors)
        .map((e) => e.errors)
        .flat();
      formatted.forEach((e) => {
        this.errorMessage = `${e.key}: ${e.value}`;
      });
    } else {
      this.triggeredAlarms = response.items;
    }
  },
  computed: {
    accessPointID() {
      return this.$loGet(this.content, 'accessPoint.id');
    },
    positionedAlarms() {
      return this.$loGet(this.content, 'accessPoint.alarmInstance');
    },
  },
};
</script>

<style lang="scss" scoped></style>
