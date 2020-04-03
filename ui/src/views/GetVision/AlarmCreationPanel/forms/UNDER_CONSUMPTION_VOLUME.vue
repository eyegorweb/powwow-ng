<template>
  <AlarmCreationBaseForm
    :alarm="alarm"
    have-form
    @save="onSave"
    @scope="scopeChoice = $event"
    :check-errors-fn="isFormValid"
    :duplicate-from="duplicateFrom"
  >
    <ConsumptionForm @change="values = $event" :duplicate-from="duplicateFrom" />
  </AlarmCreationBaseForm>
</template>

<script>
import AlarmCreationBaseForm from './AlarmCreationBaseForm';
import ConsumptionForm from './ConsumptionForm';
import { mapMutations } from 'vuex';
import { alarmOnUnderConso } from '@/api/alarmCreation';
import { modifyUnderConso } from '@/api/alarmsModifications';

export default {
  components: {
    AlarmCreationBaseForm,
    ConsumptionForm,
  },
  props: {
    alarm: Object,
    duplicateFrom: Object,
  },
  data() {
    return {
      values: undefined,
      scopeChoice: undefined,
    };
  },
  methods: {
    ...mapMutations(['flashMessage', 'closePanel']),

    isFormValid() {
      if (!this.values) return false;

      let isFormValid =
        !!parseInt(this.values.dataES) ||
        !!parseInt(this.values.dataOut) ||
        !!parseInt(this.values.dataIn) ||
        !!parseInt(this.values.smsES) ||
        !!parseInt(this.values.smsIn) ||
        !!parseInt(this.values.smsOut) ||
        !!parseInt(this.values.voiceES) ||
        !!parseInt(this.values.voiceIn) ||
        !!parseInt(this.values.VoiceOut);

      if (this.values.period === 'CUSTOM') {
        isFormValid &= !!this.values.customPeriodValue;
      }

      return isFormValid;
    },
    async onSave(payload) {
      const params = {
        ...payload,
        scope: this.scopeChoice,
        formData: this.values,
      };

      let response;

      if (this.duplicateFrom && this.duplicateFrom.toModify) {
        response = await modifyUnderConso({ ...params, id: this.duplicateFrom.id });
      } else {
        response = await alarmOnUnderConso(params);
      }

      if (response.errors && response.errors.length) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }

      this.closePanel({ resetSearch: true });
    },
  },
};
</script>
