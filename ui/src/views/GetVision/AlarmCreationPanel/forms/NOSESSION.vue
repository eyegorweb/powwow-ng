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
    <SectionTitle :num="num">{{
      $t('getvsion.alarm-creation.defineThresholdSession')
    }}</SectionTitle>

    <div class="values-container standard-mode">
      <div class="item">
        <span>{{ $t('getparc.lineDetail.alarms.data_disconnect') }} (min)</span>
        <UiInput
          class="value-input"
          :input-style="inputStyle"
          input-type="number"
          v-model="dataNoSession"
          positive-number
        />
      </div>
      <div class="item">
        <span>{{ $t('getparc.lineDetail.alarms.data_session') }} (min)</span>
        <UiInput
          class="value-input"
          :input-style="inputStyle"
          input-type="number"
          v-model="dataInactiveSession"
          positive-number
        />
      </div>
    </div>
  </AlarmCreationBaseForm>
</template>

<script>
import AlarmCreationBaseForm from './AlarmCreationBaseForm';
import UiInput from '@/components/ui/UiInput';
import SectionTitle from '@/components/SectionTitle';
import { mapMutations } from 'vuex';
import { createInactivityAlarm } from '@/api/alarmCreation';
import { updateInactivityAlarm } from '@/api/alarmsModifications';

export default {
  components: {
    AlarmCreationBaseForm,
    UiInput,
    SectionTitle,
  },
  props: {
    alarm: Object,
    duplicateFrom: Object,
    partner: Object,
  },
  mounted() {
    if (this.editMode) {
      this.num = 1;
      this.dataNoSession = this.duplicateFrom.dataNoSession;
      this.dataInactiveSession = this.duplicateFrom.dataInactiveSession;
    }
  },
  data() {
    return {
      values: undefined,
      scopeChoice: undefined,
      isLoading: false,
      dataNoSession: null,
      dataInactiveSession: null,
      inputStyle: {
        padding: '0.3rem',
        fontSize: '0.8rem',
        height: '2.2rem',
      },
      num: 3,
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
      let isFormValid = !!parseInt(this.dataNoSession) || !!parseInt(this.dataInactiveSession);

      return isFormValid;
    },

    async onSave(payload) {
      const params = {
        ...payload,
        scope: this.scopeChoice,
        formData: {
          dataNoSession: this.dataNoSession,
          dataInactiveSession: this.dataInactiveSession,
        },
      };
      let response;
      if (this.editMode) {
        this.isLoading = true;
        response = await updateInactivityAlarm({ ...params, id: this.duplicateFrom.id });
        this.isLoading = false;
      } else {
        this.isLoading = true;
        response = await createInactivityAlarm(params);
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
