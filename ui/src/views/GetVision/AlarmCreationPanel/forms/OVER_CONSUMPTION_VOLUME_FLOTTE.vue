<template>
  <AlarmCreationBaseForm :alarm="alarm" have-form :containerHeight="'4rem'">
    <SectionTitle :num="3">Définir des seuils de déclenchement par usage (3 max.)</SectionTitle>

    <div class="d-flex justify-content-center mt-4 mb-2">
      <Toggle
        v-if="toggleValues"
        @update="currentPeriod = $event.id"
        :values="toggleValues"
        class="pl-2"
      />
    </div>

    <OverConsoDataForm v-if="currentPeriod == 'data'" />
    <OverConsoSMSForm v-if="currentPeriod == 'sms'" />
    <OverConsoVoiceForm v-if="currentPeriod == 'voice'" />

    <template v-slot:scopechoice="{partner}">
      <OfferBillingAccountChoice
        :key="'offercf_' + (partner ? partner.id : '')"
        :partner="partner"
        @change="filterForCreation = $event"
      />
    </template>
  </AlarmCreationBaseForm>
</template>

<script>
import AlarmCreationBaseForm from './AlarmCreationBaseForm';
import Toggle from '@/components/ui/UiToggle2';
import SectionTitle from '@/components/SectionTitle';
import OverConsoDataForm from './OverConsoForms/OverConsoDataForm';
import OverConsoSMSForm from './OverConsoForms/OverConsoSMSForm';
import OverConsoVoiceForm from './OverConsoForms/OverConsoVoiceForm';
import OfferBillingAccountChoice from './ScopeChoice/OfferBillingAccountChoice.vue';

export default {
  components: {
    AlarmCreationBaseForm,
    Toggle,
    SectionTitle,
    OverConsoDataForm,
    OverConsoSMSForm,
    OverConsoVoiceForm,
    OfferBillingAccountChoice,
  },
  props: {
    alarm: Object,
  },

  data() {
    return {
      filterForCreation: undefined,
      currentPeriod: 'data',
      toggleValues: [
        {
          id: 'data',
          label: 'Data',
        },
        {
          id: 'sms',
          label: 'SMS',
        },
        {
          id: 'voice',
          label: 'Voix',
        },
      ],
    };
  },
};
</script>
