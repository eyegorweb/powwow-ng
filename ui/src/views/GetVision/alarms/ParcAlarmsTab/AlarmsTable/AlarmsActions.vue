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
        additionalActions.push('actions.DISABLE');
      } else {
        additionalActions.push('actions.ENABLE');
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
    ...mapMutations(['flashMessage']),

    async onActionClicked(action) {
      if (action === 'getsim.actions.DETAIL') {
        this.$router.push({ name: 'alarmDetail', params: { alarmId: this.alarm.id } });
      }

      if (!this.canDoAsyncAction) return;

      let response;
      this.canDoAsyncAction = false;

      if (action === 'actions.ENABLE') {
        response = await enableAlarm(this.alarm.id);
      }

      if (action === 'actions.DISABLE') {
        response = await disableAlarm(this.alarm.id);
      }

      if (action === 'actions.DELETE') {
        response = await deleteAlarm(this.alarm.id);
      }

      this.canDoAsyncAction = true;

      if (response) {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      } else {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
