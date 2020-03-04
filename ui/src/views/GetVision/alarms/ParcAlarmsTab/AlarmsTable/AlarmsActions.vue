<template>
  <ActionButtons :actions="actions" @itemClick="onActionClicked" />
</template>

<script>
import ActionButtons from '@/components/DataTable/ActionButtons.vue';
import { enableAlarm, disableAlarm, deleteAlarm } from '@/api/alarms';
import { mapMutations } from 'vuex';

export default {
  components: {
    ActionButtons,
  },
  props: {
    alarm: Object,
  },

  computed: {
    actions() {
      let additionalActions = [];

      if (this.alarm.disabled) {
        additionalActions.push('actions.ENABLE');
      } else {
        additionalActions.push('actions.DISABLE');
      }

      if (!this.alarm.numberOfTargetedLines) {
        additionalActions.push('actions.DELETE');
      }

      return ['getsim.actions.DETAIL', ...additionalActions];
    },
  },

  data() {
    return {
      canDoAsyncAction: true,
    };
  },

  methods: {
    ...mapMutations(['flashMessage', 'confirmAction']),

    async onActionClicked(action) {
      const showMessage = ret => {
        if (ret) {
          this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
        } else {
          this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
        }

        this.$emit('actionIsDone');
      };

      if (action === 'getsim.actions.DETAIL') {
        this.$router.push({ name: 'alarmDetail', params: { alarmId: this.alarm.id } });
      }

      if (!this.canDoAsyncAction) return;

      let response;

      if (action === 'actions.ENABLE') {
        this.canDoAsyncAction = false;
        response = await enableAlarm(this.alarm.id);
        this.canDoAsyncAction = true;
      }

      if (action === 'actions.DISABLE') {
        this.canDoAsyncAction = false;
        response = await disableAlarm(this.alarm.id);
        this.canDoAsyncAction = true;
      }

      if (action === 'actions.DELETE') {
        this.confirmAction({
          message: 'confirmAction',
          actionFn: async () => {
            this.canDoAsyncAction = false;
            response = await deleteAlarm(this.alarm.id);
            this.canDoAsyncAction = true;

            showMessage(response);
          },
        });
        return;
      }

      showMessage(response);
    },
  },
};
</script>

<style lang="scss" scoped></style>
