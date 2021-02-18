<template>
  <AlarmCreationBaseForm
    :alarm="alarm"
    :duplicate-from="duplicateFrom"
    :partner="partner"
    @save="onSave"
    @scope="scopeChoice = $event"
    :is-loading="isLoading"
  >
  </AlarmCreationBaseForm>
</template>

<script>
import AlarmCreationBaseForm from './AlarmCreationBaseForm';
import { alarmOnDeviceChange } from '@/api/alarmCreation';
import { updateDeviceChangeAlarm } from '@/api/alarmsModifications';
import { mapMutations } from 'vuex';

export default {
  components: {
    AlarmCreationBaseForm,
  },
  props: {
    alarm: Object,
    duplicateFrom: Object,
    partner: Object,
  },
  data() {
    return {
      scopeChoice: undefined,
      isLoading: false,
    };
  },
  methods: {
    ...mapMutations(['flashMessage', 'closePanel', 'confirmAction']),

    async onSave(payload) {
      const params = {
        ...payload,
        scope: this.scopeChoice,
        formData: this.selectedOptions,
      };

      let response;

      if (this.duplicateFrom && this.duplicateFrom.toModify) {
        this.isLoading = true;
        response = await updateDeviceChangeAlarm({ ...params, id: this.duplicateFrom.id });
        this.isLoading = false;
      } else {
        this.isLoading = true;
        response = await alarmOnDeviceChange(params);
        this.isLoading = false;
      }

      const key = 'MAX_ALARM_INSTANCE_TO_CATCH_UP';
      this.onClose(response, key);
    },
    onClose(response, key) {
      if (
        response.errors &&
        response.errors.length &&
        response.errors.find(err => err.key === key)
      ) {
        setTimeout(() => {
          this.confirmAction({
            message: 'getvsion.alarm-creation.alarmPopUp',
            noOkButton: true,
            isWarning: true,
            customCloseLabel: 'close',
          });
        }, 500);
      } else if (
        response.errors &&
        response.errors.length &&
        !response.errors.find(err => err.key === key)
      ) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }
      this.closePanel({ resetSearch: true });
    },
  },
};
</script>
