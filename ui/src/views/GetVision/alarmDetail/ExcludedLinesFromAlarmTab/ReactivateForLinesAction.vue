<template>
  <ChangeAlarmStatusContainer :api-config="getApiCallConfig()" @success="$emit('success')">
    <template #form="{ firstAttemptAction }">
      <button
        class="reactivate-line-alarm btn btn-primary pl-4 pr-4 pt-2 pb-2"
        @click="firstAttemptAction"
        :disabled="alarm.disabled || rows.length === 0"
      >
        <em class="ic-Plus-Icon" />
        {{ $t('getvsion.alarm.react_alarm_lines') }}
      </button>
    </template>
  </ChangeAlarmStatusContainer>
</template>

<script>
import ChangeAlarmStatusContainer from '@/views/GetVision/alarmDetail/ChangeAlarmStatusContainer.vue';
import { formattedCurrentDate } from '@/utils/date';
import { createAlarmInstance2 } from '@/api/alarms.js';

export default {
  components: {
    ChangeAlarmStatusContainer,
  },

  props: {
    alarm: Object,
    total: Number,
    rows: Array,
    filters: Array,
  },

  methods: {
    getApiCallConfig() {
      const alarmInput = {
        alarmId: this.alarm.id,
        partyId: this.$loGet(this.alarm, 'party.id'),
        dueDate: formattedCurrentDate(true),
        notification: false,
        adminSkipGDM: false,
      };

      if (this.rows && this.rows.length) {
        alarmInput.simCardInstanceIds = this.rows.map((r) => r.id);
      } else {
        alarmInput.filters = this.filters;
      }

      return {
        params: alarmInput,
        apiFn: createAlarmInstance2,
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
