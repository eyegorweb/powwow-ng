<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-7">
          <div>
            <button class="btn btn-primary pl-4 pr-4 pt-2 pb-2" @click="reactivateLines">
              <i class="ic-Plus-Icon" />
              {{ $t('getvsion.alarm.react_alarm_lines') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createAlarmInstance2 } from '@/api/alarms.js';
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

    reactivateLines() {
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
          const response = await createAlarmInstance2(alarmInput);
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

      console.log('Disable lines here');
    },
  },
};
</script>

<style lang="scss" scoped></style>
