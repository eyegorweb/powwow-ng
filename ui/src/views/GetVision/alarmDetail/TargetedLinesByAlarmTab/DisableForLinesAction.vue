<template>
  <ChangeAlarmStatusContainer :api-config="getApiCallConfig()" @success="$emit('success')">
    <template #form="{ firstAttemptAction }">
      <div>
        <button
          class="btn btn-primary pl-4 pr-4 pt-2 pb-2 disable-alarm-button"
          @click="firstAttemptAction"
          :disabled="alarm.disabled"
        >
          <em class="ic-Minus-Icon" />
          {{ $t('getvsion.alarm.disable_alarm_lines') }}
        </button>
      </div>
      <div class="text-info">
        <template v-if="total === 1">
          {{ $t('getparc.actCreation.SINGULAR_EXCLUDED_LINES') }}
        </template>
        <template v-else>
          {{ $t('getparc.actCreation.EXCLUDED_LINES', { total: total }) }}
        </template>
      </div>
    </template>
    <template #messages>
      <div class="text-info">
        <span>
          <em class="ic-Alert-Icon" />{{ $t('getparc.actCreation.message_EXCLUDED_LINES') }}.
        </span>
      </div>
    </template>
  </ChangeAlarmStatusContainer>
</template>

<script>
import ChangeAlarmStatusContainer from '@/views/GetVision/alarmDetail/ChangeAlarmStatusContainer.vue';
import { formattedCurrentDate } from '@/utils/date';
import { deleteAlarmInstance2 } from '@/api/alarms.js';

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
        apiFn: deleteAlarmInstance2,
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
