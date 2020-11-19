<template>
  <div class="card mt-4">
    <div class="card-body">
      <div class="row">
        <div class="col-7">
          <div>
            <button class="btn btn-primary pl-4 pr-4 pt-2 pb-2" @click="disableLines">
              <i class="ic-Minus-Icon" />
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
        </div>
        <div class="col-5">
          <div class="text-info">
            <span>
              <i class="ic-Alert-Icon"></i>{{ $t('getparc.actCreation.message_EXCLUDED_LINES') }}.
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deleteAlarmInstance2 } from '@/api/alarms.js';
import { formattedCurrentDate } from '@/utils/date';
import { mapMutations } from 'vuex';

export default {
  props: {
    alarm: Object,
    total: Number,
    rows: Array,
    filters: Array,
  },

  methods: {
    ...mapMutations(['flashMessage', 'confirmAction']),

    async disableLines() {
      const alarmInput = {
        alarmId: this.alarm.id,
        partyId: this.$loGet(this.alarm, 'party.id'),
        dueDate: formattedCurrentDate(),
        notification: false,
        adminSkipGDM: false,
      };

      if (this.rows && this.rows.length) {
        alarmInput.simCardInstanceIds = this.rows.map(r => r.id);
      } else {
        alarmInput.filters = this.filters;
      }

      this.confirmAction({
        message: 'confirmAction',
        actionFn: async () => {
          const response = await deleteAlarmInstance2(alarmInput);
          if (response && response.errors && response.errors.length) {
            response.errors.forEach(e => {
              this.flashMessage({ level: 'danger', message: e.message });
            });
          }
          if (!response) {
            this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
          } else {
            this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
            this.$emit('success');
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
