<template>
  <WizardPanel :steps="steps" :synthesis="synthesis" :current-step="currentStep">
    <template slot="content">
      <OfferChoiceStep
        v-if="currentStep === 0"
        :synthesis="synthesis"
        @done="stepisDone"
        @saveSynthesis="saveSynthesis"
      />

      <SimChoiceStep
        v-if="currentStep === 1"
        :synthesis="synthesis"
        @done="stepisDone"
        @prev="previousStep"
        @saveSynthesis="saveSynthesis"
      />

      <DeliveryChoiceStep
        v-if="currentStep === 2"
        :synthesis="synthesis"
        @done="stepisDone"
        @prev="previousStep"
        @saveSynthesis="saveSynthesis"
      />
    </template>
    <template slot="synthesis">
      <WizardSynthesis
        title="digitalOffer.synthesis.title"
        :synthesis="synthesis"
        :can-save="currentStep === steps.length - 1 && canSave"
        @save="saveOrder"
        :is-loading="isLoading"
        :is-error="isError"
      >
        <template slot="errors">
          <div v-if="isError" class="alert alert-danger" role="alert">
            <ul>
              <li v-for="(value, name) in businessErrors" :key="name">
                <span v-for="(val, nom) in value" :key="nom">
                  {{ $t('digitalOffer.errors.' + nom) }}
                </span>
              </li>
            </ul>
          </div>
          <div v-if="inputErrors" class="alert alert-danger" role="alert">
            <ul>
              <li v-for="e in inputErrors" :key="e">{{ $t('digitalOffer.errors.' + e) }}</li>
            </ul>
          </div>
        </template>
      </WizardSynthesis>
    </template>
  </WizardPanel>
</template>

<script>
import WizardPanel from '@/components/WizardWithSynthesis/WizardPanel.vue';
import WizardSynthesis from './WizardSynthesis.vue';
import OfferChoiceStep from './CreatePublicOrderPanel/OfferChoiceStep.vue';
import SimChoiceStep from './CreatePublicOrderPanel/SimChoiceStep.vue';
import DeliveryChoiceStep from './CreatePublicOrderPanel/DeliveryChoiceStep.vue';
import { createDigitalOffer } from '@/api/digital';
import { fetchBillingAccounts } from '@/api/billingAccounts';
import { redirectTo } from '@/utils';
import { mapGetters } from 'vuex';
import { api } from '@/api/utils';

export default {
  components: {
    WizardPanel,
    WizardSynthesis,
    OfferChoiceStep,
    SimChoiceStep,
    DeliveryChoiceStep,
  },
  data() {
    return {
      steps: [
        { label: this.$t('digitalOffer.offer') },
        { label: this.$t('digitalOffer.simType') },
        { label: this.$t('digitalOffer.delivery') },
      ],
      synthesis: {},
      currentStep: 0,
      formattedData: {
        customerAccountId: null,
        user: {
          username: null,
          password: null,
          language: null,
        },
        shippingAddressId: null,
        simCardQuantity: null,
        simCardId: null,
        workflowId: null,
        siret: null,
        partyId: null,
        userId: null,
        shippingAddress: {
          company: null,
          address: {
            address1: null,
            address2: null,
            address3: null,
            zipCode: null,
            city: null,
            country: null,
            state: null,
          },
          contactInformation: {
            email: null,
            phone: null,
            mobile: null,
          },
          name: {
            title: null,
            firstName: null,
            lastName: null,
          },
        },
      },
      isLoading: false,
      inputErrors: undefined,
      businessErrors: undefined,
      customerAccountId: null,
      partyId: null,
      isError: false,
    };
  },

  computed: {
    ...mapGetters(['userInfos']),
    partners() {
      return this.userInfos.partners[0];
    },

    canSave() {
      return !!(this.synthesis && this.synthesis.deliveryStep);
    },
  },

  async mounted() {
    const customerAccount = await this.fetchBillingAccounts();
    if (customerAccount) {
      this.customerAccountId = customerAccount[0].id;
      this.partyId = customerAccount[0].partnerId;
    }
  },

  methods: {
    async fetchBillingAccounts(q = '', page = 0) {
      const partners = [];
      if (this.partners) {
        partners.push(this.partners);
      }
      const data = await fetchBillingAccounts(q, partners, { page, limit: 10 });
      return data.map((ba) => ({
        id: ba.id,
        label: `${ba.code} - ${ba.name}`,
        partnerId: ba.party.id,
        partner: ba.party,
      }));
    },

    reset() {
      this.currentStep = 0;
      this.synthesis = {};
    },

    previousStep(payload) {
      this.saveSynthesis(payload);
      this.currentStep--;
    },

    stepisDone(payload) {
      this.saveSynthesis(payload);
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }
    },

    saveSynthesis(payload) {
      this.synthesis = {
        ...this.synthesis,
        ...payload,
      };
    },

    async saveOrder() {
      this.formattedData = {
        customerAccountId: this.customerAccountId,
        partyId: this.partyId,
        user: {
          username: null,
          password: null,
          language: null,
        },
        shippingAddressId: null,
        simCardQuantity: this.$loGet(this.synthesis, 'simStep.selectedNumberOfSims'),
        simCardId: this.$loGet(this.synthesis, 'simStep.selectedSimTypeValue.simCard.id'),
        workflowId: this.$loGet(this.synthesis, 'offerStep.id'),
        siret: null,
        userId: null,
        shippingAddress: {
          company: this.$loGet(this.synthesis, 'deliveryStep.company'),
          address: {
            address1: this.$loGet(this.synthesis, 'deliveryStep.address.address1'),
            address2: null,
            address3: null,
            zipCode: this.$loGet(this.synthesis, 'deliveryStep.address.zipCode'),
            city: this.$loGet(this.synthesis, 'deliveryStep.address.city'),
            country: this.$loGet(this.synthesis, 'deliveryStep.address.country'),
            state: null,
          },
          contactInformation: {
            email: this.$loGet(this.synthesis, 'deliveryStep.contactInformation.email'),
            phone: this.$loGet(this.synthesis, 'deliveryStep.contactInformation.phone'),
            mobile: null,
          },
          name: {
            title: this.$loGet(this.synthesis, 'deliveryStep.name.title'),
            firstName: this.$loGet(this.synthesis, 'deliveryStep.name.firstName'),
            lastName: this.$loGet(this.synthesis, 'deliveryStep.name.lastName'),
          },
        },
      };
      this.isLoading = true;
      try {
        const token = this.$loGet(api, 'defaults.headers.common.Authorization');
        const response = await createDigitalOffer(this.formattedData, token);
        this.isLoading = false;
        console.log('response create digital offer >>>>>>>>>>', response);
        this.checkErrors(response);
        // redirection paynum
        if (response && response.url) {
          this.redirectToPaynum(response.url);
        }
      } catch (e) {
        this.isLoading = false;
        console.error('request error from API REST "digital offer create"', e);
      }
    },

    checkErrors(response) {
      console.log('response errors for commands', response);
      if (response && response.errors) {
        this.businessErrors = response.errors.map((e) => {
          let errors = {};
          switch (e) {
            case 'USER_NAME_ALREADY_EXIST':
              errors['USER_NAME_ALREADY_EXIST'] = errors['SIRET_ALREADY_EXIST'] = this.$loGet(
                this.synthesis,
                'deliveryStep.login',
                null
              );
              break;
            case 'SIRET_ALREADY_EXIST':
              errors['SIRET_ALREADY_EXIST'] = errors['SIRET_ALREADY_EXIST'] = this.$loGet(
                this.synthesis,
                'deliveryStep.siretValue',
                null
              );
              break;
            case 'SIRET_MANDATORY':
              errors['SIRET_ALREADY_EXIST'] = this.$loGet(
                this.synthesis,
                'deliveryStep.siretValue',
                null
              );
              break;
            case 'PARTY_NAME_ALREADY_EXIST':
              errors['PARTY_NAME_ALREADY_EXIST'] = this.$loGet(
                this.synthesis,
                'deliveryStep.company'
              );
              break;
            default:
              break;
          }
          return errors;
        });
        this.synthesis = {
          ...this.synthesis,
          businessErrors: this.businessErrors,
        };
        this.isError = true;
      }

      if (response && response.inputErrors) {
        this.inputErrors = response.inputErrors;
        this.synthesis = {
          ...this.synthesis,
          inputErrors: this.inputErrors,
        };
        this.isError = true;
      }
      return this.isError;
    },

    redirectToPaynum(paynumUrl) {
      redirectTo(paynumUrl);
    },
  },

  watch: {
    // synthesis(stepData) {
    //   console.log('step data', stepData);
    //   if (stepData && stepData.businessErrors && stepData.businessErrors.length) {
    //     let previousForm = [];
    //     const currentForm = [
    //       stepData.creationAccountStep.company,
    //       stepData.creationAccountStep.siretValue,
    //       stepData.creationAccountStep.login,
    //     ];
    //     stepData.businessErrors.map((error) => {
    //       for (const key in error) {
    //         previousForm.push(error[key]);
    //       }
    //     });
    //     let foundErrors = previousForm.filter((pf) => currentForm.find((cf) => cf === pf));
    //     if (foundErrors.length) {
    //       this.isError = true;
    //     } else {
    //       this.isError = false;
    //     }
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped></style>
