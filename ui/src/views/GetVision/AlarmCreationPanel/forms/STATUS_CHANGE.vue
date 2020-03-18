<template>
  <AlarmCreationBaseForm
    :alarm="alarm"
    has-form
    :check-errors-fn="isFormValid"
    @save="onSave"
    @scope="scopeChoice = $event"
  >
    <SectionTitle :num="3">Définir les status supervisés</SectionTitle>
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

export default {
  components: {
    AlarmCreationBaseForm,
    Toggle,
    SectionTitle,
  },
  props: {
    alarm: Object,
  },

  data() {
    return {
      scopeChoice: undefined,

      currentPeriod: 'ALL',
      toggleValues: [
        {
          id: 'ALL',
          label: 'Tous',
        },
        {
          id: 'ACTIVATION',
          label: 'Activation/Réactivation',
        },
        {
          id: 'SUSPENSION',
          label: 'Suspension',
        },
        {
          id: 'TERMINATION',
          label: 'Résiliation ',
        },
      ],
    };
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

      const response = await createStatusChangeAlarm(params);
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
