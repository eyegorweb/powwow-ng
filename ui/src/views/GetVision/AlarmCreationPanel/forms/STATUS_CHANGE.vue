<template>
  <AlarmCreationBaseForm
    :alarm="alarm"
    :have-form="true"
    :check-errors-fn="isFormValid"
    :duplicate-from="duplicateFrom"
    @save="onSave"
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
import { createStatusChangeAlarm } from '@/api/alarmCreation';
import { mapMutations } from 'vuex';
import { updateStatusChangeAlarm } from '@/api/alarmsModifications';

export default {
  components: {
    AlarmCreationBaseForm,
    Toggle,
    SectionTitle,
  },
  props: {
    alarm: Object,
    duplicateFrom: Object,
  },

  mounted() {
    let toggleValues = [
      {
        id: 'ALL',
        label: this.$t('getvsion.alarm-creation.supervisedStatuses.all'),
      },
      {
        id: 'ACTIVATION',
        label: this.$t('getvsion.alarm-creation.supervisedStatuses.activationReactivation'),
      },
      {
        id: 'SUSPENSION',
        label: this.$t('getvsion.alarm-creation.supervisedStatuses.suspension'),
      },
      {
        id: 'TERMINATION',
        label: this.$t('home.widgets.stateParc.cancellationLines'),
      },
    ];
    if (this.duplicateFrom) {
      this.currentPeriod = this.duplicateFrom.triggerCommercialStatus;
      toggleValues = toggleValues.map(t => {
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
    ...mapMutations(['flashMessage', 'closePanel']),

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
        response = await updateStatusChangeAlarm({ ...params, id: this.duplicateFrom.id });
      } else {
        response = await createStatusChangeAlarm(params);
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
