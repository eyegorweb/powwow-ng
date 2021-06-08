<template>
  <AlarmCreationBaseForm
    :alarm="alarm"
    :have-form="true"
    :check-errors-fn="isFormValid"
    :duplicate-from="duplicateFrom"
    :partner="partner"
    @save="onSave"
    :is-loading="isLoading"
    @scope="scopeChoice = $event"
  >
    <SectionTitle :num="numStep">
      {{ $t('getvsion.alarm-creation.setSupervisedStatuses') }}
    </SectionTitle>
    <Toggle
      v-if="toggleValues"
      @update="currentPeriod = $event.id"
      :values="toggleValues"
      class="pl-2"
    />
  </AlarmCreationBaseForm>
</template>

<script>
import AlarmCreationBaseForm from './AlarmCreationBaseForm';
import Toggle from '@/components/ui/UiToggle2';
import SectionTitle from '@/components/SectionTitle';
import { createStatusChangeProfileAlarm } from '@/api/alarmCreation';
import { mapMutations } from 'vuex';
// import { updateStatusChangeAlarm } from '@/api/alarmsModifications';

export default {
  components: {
    AlarmCreationBaseForm,
    Toggle,
    SectionTitle,
  },
  props: {
    alarm: Object,
    duplicateFrom: Object,
    partner: Object,
  },

  mounted() {
    let toggleValues = [
      {
        id: 'ALL',
        label: this.$t('getvsion.alarm-creation.supervisedStatusesESIM.all'),
      },
      {
        id: 'ENABLED',
        label: this.$t('getvsion.alarm-creation.supervisedStatusesESIM.enabled'),
      },
      {
        id: 'DISABLED',
        label: this.$t('getvsion.alarm-creation.supervisedStatusesESIM.disabled'),
      },
      {
        id: 'DELETED',
        label: this.$t('getvsion.alarm-creation.supervisedStatusesESIM.deleted'),
      },
    ];
    if (this.duplicateFrom) {
      this.currentPeriod = this.duplicateFrom.triggerCommercialStatus;
      toggleValues = toggleValues.map((t) => {
        if (t.id === this.duplicateFrom.triggerCommercialStatus) {
          t.default = true;
        }
        return t;
      });
    }

    this.toggleValues = toggleValues;
  },

  data() {
    return {
      scopeChoice: undefined,
      isLoading: false,
      currentPeriod: 'ALL',
      toggleValues: undefined,
    };
  },

  computed: {
    editMode() {
      return this.duplicateFrom && this.duplicateFrom.toModify;
    },
    numStep() {
      return this.editMode ? 1 : 3;
    },
  },

  methods: {
    ...mapMutations(['flashMessage', 'closePanel', 'confirmAction']),

    isFormValid() {
      return true;
    },
    async onSave(payload) {
      const params = {
        ...payload,
        scope: this.scopeChoice,
        formData: this.currentPeriod,
      };

      let response;

      if (this.duplicateFrom && this.duplicateFrom.toModify) {
        this.isLoading = true;
        // response = await updateStatusChangeAlarm({ ...params, id: this.duplicateFrom.id });
        console.log("en attende de l'api de modification pour ce type d'alarme");
        this.isLoading = false;
      } else {
        this.isLoading = true;
        response = await createStatusChangeProfileAlarm(params);
        this.isLoading = false;
      }

      const key = 'MAX_ALARM_INSTANCE_TO_CATCH_UP';
      this.onClose(response, key);
    },
    onClose(response, key) {
      if (
        response.errors &&
        response.errors.length &&
        response.errors.find((err) => err.key === key)
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
        !response.errors.find((err) => err.key === key)
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
