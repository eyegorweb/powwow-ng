<template>
  <AlarmCreationBaseForm
    :alarm="alarm"
    :duplicate-from="duplicateFrom"
    :partner="partner"
    have-form
    @save="onSave"
    @scope="scopeChoice = $event"
    :suspension="true"
    :check-errors-fn="isFormValid"
    :is-loading="isLoading"
    :num-notif="5"
  >
    <ConsumptionForm @change="values = $event" :duplicate-from="duplicateFrom" :partner="partner" />
    <fluxSelect
      v-if="duplicateFrom"
      :data="streamFlux"
      @selectedStream="selectedStream"
      :streamInfos="duplicateFrom.pdpSplitConfig"
    />
  </AlarmCreationBaseForm>
</template>

<script>
import AlarmCreationBaseForm from './AlarmCreationBaseForm';
import ConsumptionForm from './ConsumptionForm';
import fluxSelect from './fluxSelect';
import { mapMutations } from 'vuex';
import { alarmOnOverConso } from '@/api/alarmCreation';
import { modifyOverConso } from '@/api/alarmsModifications';
import { getPartnerFlux } from '@/api/partners';

export default {
  components: {
    AlarmCreationBaseForm,
    ConsumptionForm,
    fluxSelect,
  },
  props: {
    alarm: Object,
    duplicateFrom: Object,
    partner: Object,
  },
  data() {
    return {
      values: undefined,
      scopeChoice: undefined,
      initValues: undefined,
      isLoading: false,
      partnerId: undefined,
      streamFlux: undefined,
      fluxChoice: undefined,
    };
  },
  watch: {
    scopeChoice(newValue) {
      if (newValue && newValue.partner) {
        this.getFlux(newValue.partner.id);
      }
    },
  },
  mounted() {
    if (this.duplicateFrom) {
      this.getFlux(this.duplicateFrom.party.id)
      this.initValues = {
        dataES: this.duplicateFrom.level1,
        dataOut: this.duplicateFrom.level1Up,
        dataIn: this.duplicateFrom.level1Down,
        smsES: this.duplicateFrom.level2,
        smsOut: this.duplicateFrom.level2Up,
        smsIn: this.duplicateFrom.level2Down,
        voiceES: this.duplicateFrom.level3,
        voiceOut: this.duplicateFrom.level3Up,
        voiceIn: this.duplicateFrom.level3Down,
        streamId: this.duplicateFrom.pdpSplitConfig.id,
      };
    }
  },
  methods: {
    ...mapMutations(['flashMessage', 'closePanel', 'confirmAction']),

    async getFlux(id) {
      this.streamFlux = await getPartnerFlux(id);
    },

    selectedStream(item) {
      this.fluxChoice = item;
    },
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
        !!parseInt(this.values.voiceOut);

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
        streamId: this.fluxChoice,
      };

      let response;

      if (this.duplicateFrom && this.duplicateFrom.toModify) {
        this.isLoading = true;
        response = await modifyOverConso({ ...params, id: this.duplicateFrom.id });
        this.isLoading = false;
      } else {
        const paramsToSend = { ...params };
        if (this.scopeChoice && this.scopeChoice.partner && this.scopeChoice.partner.id) {
          paramsToSend.id = this.scopeChoice.partner.id;
        }
        this.isLoading = true;
        response = await alarmOnOverConso(paramsToSend);
        this.isLoading = false;
      }
      this.onClose(response);
    },
    onClose(response) {
      const errorKeys = ['MAX_ALARM_INSTANCE_TO_CATCH_UP', 'ALARMS_D_MAX_ALARM_PER_AP_REACHED'];
      if (
        response.errors &&
        response.errors.length &&
        response.errors.find((err) => err.key === errorKeys[0])
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
        response.errors.find((err) => err.extensions.alarm === errorKeys[1])
      ) {
        this.flashMessage({
          level: 'danger',
          message: this.$t('alarms.errors.ALARMS_D_MAX_ALARM_PER_AP_REACHED'),
        });
      } else if (
        response.errors &&
        response.errors.length &&
        !response.errors.find((err) => err.key === errorKeys[0])
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
