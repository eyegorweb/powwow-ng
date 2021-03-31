<template>
  <WizardPanel :steps="steps">
    <template v-slot:content="{ currentStep, stepisDone, previousStep, saveSynthesis, synthesis }">
      <ClientChoiceStep
        v-if="currentStep === 0"
        :synthesis="synthesis"
        @done="stepisDone"
        @saveSynthesis="saveSynthesis"
      />

      <ProductChoiceStep
        v-if="currentStep === 1"
        :synthesis="synthesis"
        @done="stepisDone"
        @prev="previousStep"
        @saveSynthesis="saveSynthesis"
      />

      <ServicesChoiceStep
        v-if="currentStep === 2"
        :synthesis="synthesis"
        @done="stepisDone"
        @prev="previousStep"
        @saveSynthesis="saveSynthesis"
      />
      <PairingStep
        v-if="currentStep === 3"
        :synthesis="synthesis"
        @done="stepisDone"
        @prev="previousStep"
        @saveSynthesis="saveSynthesis"
      />
      <SettingsStep
        v-if="currentStep === 4"
        :synthesis="synthesis"
        @done="stepisDone"
        @prev="previousStep"
        @saveSynthesis="saveSynthesis"
      />
    </template>
    <template v-slot:synthesis="{ currentStep, synthesis }">
      <WizardSynthesis
        title="getsim.reservasions.synthesis"
        :synthesis="synthesis"
        :can-save="currentStep === steps.length - 1"
        @save="saveReservation"
      />
    </template>
  </WizardPanel>
</template>

<script>
import WizardPanel from '@/components/WizardWithSynthesis/WizardPanel.vue';
import WizardSynthesis from '@/components/WizardWithSynthesis/WizardSynthesis.vue';
import ClientChoiceStep from './ClientChoiceStep.vue';
import ProductChoiceStep from './ProductChoiceStep.vue';
import ServicesChoiceStep from './ServicesChoiceStep.vue';
import PairingStep from './PairingStep.vue';
import SettingsStep from './SettingsStep.vue';

export default {
  components: {
    WizardPanel,
    WizardSynthesis,
    ClientChoiceStep,
    ProductChoiceStep,
    ServicesChoiceStep,
    PairingStep,
    SettingsStep,
  },
  data() {
    return {
      steps: [
        { label: this.$t('orders.new.customer') },
        { label: this.$t('orders.new.product') },
        { label: this.$t('orders.new.service') },
        { label: this.$t('getsim.reservasions.creation.pairing') },
        { label: this.$t('orders.new.settings') },
      ],
    };
  },

  methods: {
    saveReservation() {},
  },
};
</script>

<style lang="scss" scoped></style>
