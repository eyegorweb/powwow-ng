<template>
  <div>
    <span v-if="alarmIsToggled">{{ $t(processingActionText) }}...</span>
    <button v-else @click.prevent="toggleAlarmInstance" class="btn btn-link p-0">
      {{ $t(actionText) }}
    </button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { formattedCurrentDate } from '@/utils/date';
import { createAlarmInstance, deleteAlarmInstance } from '@/api/alarms';

export default {
  props: {
    alarm: Object,
    simcard: Object,
  },
  data() {
    return {
      alarmIsToggled: false,
      warningMsg: undefined,
    };
  },

  computed: {
    actionText() {
      return this.alarm.isActive
        ? 'getparc.lineDetail.alarms.disableLine'
        : 'getparc.lineDetail.alarms.enableLine';
    },

    processingActionText() {
      return this.alarm.isActive
        ? 'getparc.actLines.simStatuses.DEACTIVATION'
        : 'getparc.actLines.simStatuses.ACTIVATING';
    },
  },

  methods: {
    ...mapMutations(['confirmAction']),

    toggleAlarmInstance() {
      let actionFn;
      const args = [
        this.simcard.id,
        this.alarm.alarm.id,
        this.simcard.party.id,
        formattedCurrentDate(),
      ];
      if (this.alarm.isActive) {
        this.warningMsg = this.$t('getparc.actLines.alarmList.confirmationWarning');
        actionFn = deleteAlarmInstance;
      } else {
        this.warningMsg = 'confirmAction';
        actionFn = createAlarmInstance;
      }

      this.confirmAction({
        message: this.warningMsg,
        actionFn: async () => {
          await actionFn(...args);
          this.alarmIsToggled = !this.alarmIsToggled;
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  text-align: inherit;
  font-weight: 600;
}
</style>
