<template>
  <AlarmCreationBaseForm
    :alarm="alarm"
    :duplicate-from="duplicateFrom"
    :partner="partner"
    @save="onSave"
    @scope="scopeChoice = $event"
    :is-loading="isLoading"
    :check-errors-fn="isFormValid"
    have-form
    partner-feature="ATYPICAL_ALARM"
    no-wsnotification
  >
    <AtypicalAlarmConsumptionForm
      @change="values = $event"
      :duplicate-from="duplicateFrom"
      :partner="partner"
    />
  </AlarmCreationBaseForm>
</template>

<script>
import AlarmCreationBaseForm from './AlarmCreationBaseForm';
import AtypicalAlarmConsumptionForm from './AtypicalAlarmConsumptionForm.vue';
import { mapMutations } from 'vuex';
import { createAtypicalAlarm } from '@/api/alarmCreation';
import { updateAtypicalAlarm } from '@/api/alarmsModifications';

export default {
  components: {
    AlarmCreationBaseForm,
    AtypicalAlarmConsumptionForm,
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
      isLoading: false,
    };
  },
  computed: {
    editMode() {
      return this.duplicateFrom && this.duplicateFrom.toModify;
    },
  },
  methods: {
    ...mapMutations(['flashMessage', 'closePanel', 'confirmAction']),

    isFormValid() {
      if (!this.values) return false;

      let isFormValid =
        !!parseInt(this.values.voiceCallsThreshold) ||
        !!parseInt(this.values.voiceCallsInThreshold) ||
        !!parseInt(this.values.voiceCallsOutThreshold) ||
        !!parseInt(this.values.pdpSessionsThreshold);

      if (this.values.currentPeriod === 'CUSTOM') {
        isFormValid &= !!this.values.customPeriodValue;
      }

      return isFormValid;
    },

    async onSave(payload) {
      const params = {
        ...payload,
        scope: this.scopeChoice,
        formData: {
          alarmAtypicalDetails: this.values,
        },
      };
      let response;
      if (this.editMode) {
        this.isLoading = true;
        response = await updateAtypicalAlarm({ ...params, id: this.duplicateFrom.id });
        this.isLoading = false;
      } else {
        this.isLoading = true;
        response = await createAtypicalAlarm(params);
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
  mounted() {},
};
</script>

<style lang="scss" scoped>
.values-container {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid $medium-gray;
  padding: 0.5rem;
  border-radius: 0.2rem;

  width: 100%;

  &.standard-mode {
    width: 45%;
    flex-direction: column;
  }

  .item {
    flex-basis: 30%;
    display: flex;
    justify-content: flex-end;

    span {
      font-size: 0.9rem;
      top: 0.4rem;
      position: relative;
    }

    .value-input {
      padding-left: 1rem;
      padding-right: 1rem;
      flex-basis: 40%;
    }
  }
}
</style>
