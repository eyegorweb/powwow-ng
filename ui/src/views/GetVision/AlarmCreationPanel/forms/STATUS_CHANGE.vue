<template>
  <AlarmCreationBaseForm :alarm="alarm" has-form>
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
      currentPeriod: 'all',
      toggleValues: [
        {
          id: 'all',
          label: 'Tous',
        },
        {
          id: 'activate_reactivate',
          label: 'Activation/Réactivation',
        },
        {
          id: 'suspend',
          label: 'Suspension',
        },
        {
          id: 'terminate',
          label: 'Résiliation ',
        },
      ],
    };
  },
};
</script>
