<template>
  <WizardPanel :steps="steps">
    <template #content="{ currentStep, stepisDone, previousStep, saveSynthesis, synthesis }">
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
    <template #synthesis="{ currentStep, synthesis }">
      <WizardSynthesis
        title="getsim.reservations.synthesis"
        :synthesis="synthesis"
        :can-save="currentStep === steps.length - 1"
        @save="saveReservation"
      />
    </template>
  </WizardPanel>
</template>

<script>
import WizardPanel from '@/components/WizardWithSynthesis/WizardPanel.vue';
import WizardSynthesis from './WizardSynthesis.vue';
import ClientChoiceStep from './ClientChoiceStep.vue';
import ProductChoiceStep from './ProductChoiceStep.vue';
import ServicesChoiceStep from './ServicesChoiceStep.vue';
import PairingStep from './PairingStep.vue';
import SettingsStep from './SettingsStep.vue';
import { createEsimReservation } from '@/api/esim.js';
import { mapMutations } from 'vuex';

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
        { label: this.$t('getsim.reservations.creation.pairing') },
        { label: this.$t('orders.new.settings') },
      ],
    };
  },

  methods: {
    ...mapMutations(['flashMessage', 'closePanel']),

    setIfPresent(targetobj, key, value) {
      if (value) {
        targetobj[key] = value;
      }
    },

    async saveReservation(synthesis) {
      const esimReservationInput = {
        customerAccountId: this.$loGet(synthesis, 'stepClient.billingAccount.id'),
        simCardQuantity: parseInt(this.$loGet(synthesis, 'stepProduct.quantity')),
        preActivationAsked: this.$loGet(synthesis, 'serviceStep.preActivation'),
        activationAsked: this.$loGet(synthesis, 'serviceStep.activation'),
        pairingAsked: !!this.$loGet(synthesis, 'pairingStep.response.tempDataUuid'),
        downloadProfilAsked: this.$loGet(synthesis, 'pairingStep.profile.id') === 'NO',
        simCardId: this.$loGet(synthesis, 'stepProduct.selectedSimTypeValue.simCard.id'),
      };

      this.setIfPresent(
        esimReservationInput,
        'externalId',
        this.$loGet(synthesis, 'settingsStep.selection.orderReference')
      );

      this.setIfPresent(
        esimReservationInput,
        'uuid',
        this.$loGet(synthesis, 'pairingStep.response.tempDataUuid')
      );

      this.setIfPresent(
        esimReservationInput,
        'workflowId',
        this.$loGet(synthesis, 'serviceStep.selectedOffer.id')
      );

      if (this.$loGet(synthesis, 'settingsStep.customFields.selection')) {
        const customFieldsSelection = this.$loGet(synthesis, 'settingsStep.customFields.selection');
        esimReservationInput.customFieldsDTO = {};
        customFieldsSelection.forEach((c) => {
          esimReservationInput.customFieldsDTO[c.code] = c.value;
        });
      }

      let selectedServicesInput = [];

      if (this.$loGet(synthesis, 'serviceStep.servicesChoice.services')) {
        const services = this.$loGet(synthesis, 'serviceStep.servicesChoice.services');
        const checkedServices = services
          .filter((s) => s.checked)
          .map((s) => ({
            serviceCode: s.code,
          }));

        const dataServiceChoice = this.$loGet(synthesis, 'serviceStep.servicesChoice.dataService');

        let serviceParamsArr = [];
        if (dataServiceChoice) {
          if (dataServiceChoice.checked) {
            const paramsArr = dataServiceChoice.parameters
              .filter((p) => p.selected)
              .map((p) => p.code);
            serviceParamsArr.push({ serviceCode: 'DATA', serviceParameters: paramsArr });
          }
        }

        selectedServicesInput = [...serviceParamsArr, ...checkedServices];
      }

      const input = {
        esimReservationInput,
        selectedServicesInput,
      };
      const response = await createEsimReservation(input);
      if (!response) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
        this.closePanel({ resetSearch: true });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
