<template>
  <ChangeAlarmStatusContainer :api-config="getApiCallConfig()" @success="$emit('success')">
    <template #form="{ firstAttemptAction }">
      <div>
        <button
          class="btn btn-primary pl-4 pr-4 pt-2 pb-2 disable-alarm-button"
          @click="firstAttemptAction"
          :disabled="isLoading || alarm.disabled"
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
          {{ $t('getparc.actCreation.EXCLUDED_LINES', { total: $formatLargeNumber(total) }) }}
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
import { mapMutations } from 'vuex';

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

  data() {
    return {
      isLoading: false,
    };
  },

  methods: {
    ...mapMutations(['popupMessage']),

    manageErrors(errors) {
      if (errors && errors.length) {
        for (let i = 0; i < errors.length; i++) {
          if (this.$loGet(errors[i], 'extensions.error') === 'ALARM_SET_LIMIT') {
            setTimeout(() => {
              this.popupMessage(
                this.$t('getparc.lineDetail.alarms.limiterror', {
                  limit: this.$loGet(errors[i], 'extensions.limit'),
                })
              );
            }, 500);
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
            id: 'filter.eq.id',
            value: this.alarm.id,
          },
        ];
      }

      return {
        params: alarmInput,
        apiFn: async (params) => {
          this.isLoading = true;
          const response = await deleteAlarmInstance2(params);
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
