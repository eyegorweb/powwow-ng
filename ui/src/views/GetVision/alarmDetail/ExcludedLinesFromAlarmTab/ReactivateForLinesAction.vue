<template>
  <ChangeAlarmStatusContainer :api-config="getApiCallConfig()" @success="$emit('success')">
    <template #form="{ firstAttemptAction }">
      <button
        class="reactivate-line-alarm btn btn-primary pl-4 pr-4 pt-2 pb-2"
        @click="firstAttemptAction"
        :disabled="isLoading || alarm.disabled"
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
import { mapMutations } from 'vuex';

export default {
  components: {
    ChangeAlarmStatusContainer,
  },

  data() {
    return {
      isLoading: false
    }
  },

  props: {
    alarm: Object,
    total: Number,
    rows: Array,
    filters: Array,
  },

  methods: {
    ...mapMutations(['flashMessage']),

    manageErrors(errors) {
      if (errors && errors.length) {
        for (let i = 0; i < errors.length; i++) {
          if (this.$loGet(errors[i], 'extensions.error')==='ALARM_SET_LIMIT') {
            this.flashMessage({ level: 'danger', message: this.$t('limiterror') });
          }
        }
      }
    },
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
        alarmInput.filters = [
          ...this.filters,
          {
            id: 'filter.ne.id',
            value: this.alarm.id,
          },
        ];
      }

      return {
        params: alarmInput,
        apiFn: async (params) => {
          this.isLoading = true;
          const response = await createAlarmInstance2(params);
          if (response.errors) {
            this.manageErrors(response.errors);
          }
          this.isLoading = false;
          return response;
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
