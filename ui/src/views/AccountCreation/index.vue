<template>
  <div class="cd-panel__container">
    <div class="cd-panel__content">
      <div class="creation-panel">
        <div class="stepper-container">
          <div class="account-creation-stepper">
            <div class="card">
              <Stepper :key="$i18n.locale" :steps="steps" :selected-index="currentStep" />
              <div class="p-4 pb8">
                <keep-alive>
                  <router-view
                    :key="$route.fullPath"
                    :synthesis="synthesis"
                    @done="done"
                  ></router-view>
                </keep-alive>
              </div>
            </div>
          </div>
        </div>
        <CreateAccountPanelSynthesis
          :synthesis="synthesis"
          :can-save="currentStep === steps.length - 1 && canSave"
          @save="saveAccount"
          :is-loading="isLoading"
          :is-error="isError"
          class="panelSynthesis"
        >
          <template slot="errors">
            <div v-if="isError" class="alert alert-danger" role="alert">
              <ul>
                <li v-for="(value, key) in businessErrors" :key="key">
                  <span>
                    {{ $t('digitalOffer.errors.' + key) }}
                  </span>
                </li>
              </ul>
              <ul>
                <li v-for="(value, key) in requestErrors" :key="key">
                  <span>
                    {{ $t('digitalOffer.errors.' + value) }}
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
        </CreateAccountPanelSynthesis>
      </div>
    </div>
  </div>
</template>

<script>
import Stepper from '@/components/ui/Stepper';
import { createDigitalOffer } from '@/api/digital.js';
import CreateAccountPanelSynthesis from './CreateAccountPanelSynthesis';
import { redirectTo } from '@/utils';

export default {
  components: {
    Stepper,
    CreateAccountPanelSynthesis,
  },

  mounted() {
    // url page anonyme: http://localhost:8081/p/create-account
    // si utilisateur connecté aller directement vers le choix Offre
    // this.$router.push({ name: 'createAccount.offer' });
    // sinon aller à la création de partenaire
    if (window.location.href.includes('create-account/ok')) {
      const hashParts = window.location.href.split('/ok/');
      this.$router.push({ name: 'createAccount.ok', params: { paymentId: hashParts[1] } });
    } else if (window.location.href.includes('create-account/ko')) {
      const hashParts = window.location.href.split('/ko/');
      this.$router.push({ name: 'createAccount.ko', params: { paymentId: hashParts[1] } });
    } else {
      this.$router.push({ name: 'createAccount.partner' });
    }
  },

  data() {
    return {
      synthesis: {},
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
        intraCommunityVAT: null,
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
        accountAddress: {
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
      businessErrors: {},
      requestErrors: undefined,
      isError: false,
    };
  },

  computed: {
    currentStep() {
      const index = this.steps.findIndex((s) => s.route === this.$route.name);
      return index !== -1 ? index : 0;
    },
    steps() {
      return [
        {
          label: this.$t('digitalOffer.accountCreation'),
          route: 'createAccount.partner',
        },
        {
          label: this.$t('digitalOffer.offer'),
          route: 'createAccount.offer',
        },
        {
          label: this.$t('digitalOffer.simType'),
          route: 'createAccount.simChoice',
        },
        {
          label: this.$t('digitalOffer.delivery'),
          route: 'createAccount.delivery',
        },
      ];
    },

    canSave() {
      return !!(this.synthesis && this.synthesis.deliveryStep);
    },

    localeNavigatorLanguage() {
      return this.$loGet(navigator, 'language').split('-')[0];
    },

    deliveryCountryCode() {
      if (this.$loGet(this.synthesis, 'deliveryStep')) {
        return this.$loGet(this.synthesis, 'deliveryStep.country.data')
          ? this.$loGet(this.synthesis, 'deliveryStep.country.data.code')
          : this.$loGet(this.synthesis, 'deliveryStep.country.code');
      }
      return '';
    },
  },

  methods: {
    async saveAccount() {
      this.formattedData = {
        customerAccountId: null,
        user: {
          username: this.$loGet(this.synthesis, 'creationAccountStep.login'),
          password: this.$loGet(this.synthesis, 'creationAccountStep.password'),
          language: this.localeNavigatorLanguage,
        },
        shippingAddressId: null,
        simCardQuantity: this.$loGet(this.synthesis, 'simStep.selectedNumberOfSims'),
        simCardId: this.$loGet(this.synthesis, 'simStep.selectedSimTypeValue.simCard.id'),
        workflowId: this.$loGet(this.synthesis, 'offerStep.id'),
        siret: this.$loGet(this.synthesis, 'creationAccountStep.siretValue'),
        intraCommunityVAT: this.$loGet(this.synthesis, 'creationAccountStep.tvaValue'),
        partyId: null,
        userId: null,
        shippingAddress: {
          company: this.$loGet(this.synthesis, 'deliveryStep.company'),
          address: {
            address1: this.$loGet(this.synthesis, 'deliveryStep.address'),
            address2: null,
            address3: null,
            zipCode: this.$loGet(this.synthesis, 'deliveryStep.zipCode'),
            city: this.$loGet(this.synthesis, 'deliveryStep.city'),
            country: this.deliveryCountryCode,
            state: null,
          },
          contactInformation: {
            email: this.$loGet(this.synthesis, 'deliveryStep.email'),
            phone: this.$loGet(this.synthesis, 'deliveryStep.phone'),
            mobile: null,
          },
          name: {
            title: this.$loGet(this.synthesis, 'deliveryStep.title'),
            firstName: this.$loGet(this.synthesis, 'deliveryStep.firstName'),
            lastName: this.$loGet(this.synthesis, 'deliveryStep.lastName'),
          },
        },
        accountAddress: {
          company: this.$loGet(this.synthesis, 'creationAccountStep.company'),
          address: {
            address1: this.$loGet(this.synthesis, 'creationAccountStep.address'),
            address2: null,
            address3: null,
            zipCode: this.$loGet(this.synthesis, 'creationAccountStep.zipCode'),
            city: this.$loGet(this.synthesis, 'creationAccountStep.city'),
            country: this.$loGet(this.synthesis, 'creationAccountStep.country.code'),
            state: null,
          },
          contactInformation: {
            email: this.$loGet(this.synthesis, 'creationAccountStep.email'),
            phone: this.$loGet(this.synthesis, 'creationAccountStep.phone'),
            mobile: null,
          },
          name: {
            title: this.$loGet(this.synthesis, 'creationAccountStep.title'),
            firstName: this.$loGet(this.synthesis, 'creationAccountStep.firstName'),
            lastName: this.$loGet(this.synthesis, 'creationAccountStep.lastName'),
          },
        },
      };
      this.isLoading = true;
      try {
        const response = await createDigitalOffer(this.formattedData);
        this.isLoading = false;
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

    done(steps) {
      this.synthesis = {
        ...this.synthesis,
        ...steps,
      };
    },

    checkErrors(response) {
      if (response && response.errors) {
        this.requestErrors = response.errors.filter(
          (e) =>
            e !== 'USER_NAME_ALREADY_EXIST' &&
            e !== 'SIRET_ALREADY_EXIST' &&
            e !== 'INTRA_COMMUNITY_VAT_MANDATORY' &&
            e !== 'INTRA_COMMUNITY_VAT_ALREADY_EXIST' &&
            e !== 'PARTY_NAME_ALREADY_EXIST' &&
            e !== 'SIRET_MANDATORY'
        );
        if (this.requestErrors) {
          this.isError = true;
        }
        const businessErrors = response.errors.filter(
          (e) =>
            e === 'USER_NAME_ALREADY_EXIST' ||
            e === 'SIRET_ALREADY_EXIST' ||
            e === 'INTRA_COMMUNITY_VAT_MANDATORY' ||
            e === 'INTRA_COMMUNITY_VAT_ALREADY_EXIST' ||
            e === 'PARTY_NAME_ALREADY_EXIST' ||
            e === 'SIRET_MANDATORY'
        );
        if (businessErrors.find((e) => e === 'USER_NAME_ALREADY_EXIST')) {
          this.businessErrors['USER_NAME_ALREADY_EXIST'] = this.synthesis.creationAccountStep.login;
        }
        if (businessErrors.find((e) => e === 'SIRET_ALREADY_EXIST')) {
          this.businessErrors[
            'SIRET_ALREADY_EXIST'
          ] = this.synthesis.creationAccountStep.siretValue;
        }
        if (businessErrors.find((e) => e === 'INTRA_COMMUNITY_VAT_MANDATORY')) {
          this.businessErrors[
            'INTRA_COMMUNITY_VAT_MANDATORY'
          ] = this.synthesis.creationAccountStep.tvaValue;
        }
        if (businessErrors.find((e) => e === 'INTRA_COMMUNITY_VAT_ALREADY_EXIST')) {
          this.businessErrors[
            'INTRA_COMMUNITY_VAT_ALREADY_EXIST'
          ] = this.synthesis.creationAccountStep.tvaValue;
        }
        if (businessErrors.find((e) => e === 'SIRET_MANDATORY')) {
          this.businessErrors['SIRET_MANDATORY'] = this.synthesis.creationAccountStep.siretValue;
        }
        if (businessErrors.find((e) => e === 'PARTY_NAME_ALREADY_EXIST')) {
          this.businessErrors[
            'PARTY_NAME_ALREADY_EXIST'
          ] = this.synthesis.creationAccountStep.company;
        }

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
    $route() {
      const stepData = this.$loGet(this.$route, 'params.step');
      if (!this.synthesis) {
        this.synthesis = {};
      }
      if (stepData) {
        this.synthesis = {
          ...this.synthesis,
          ...stepData,
        };
      }
    },

    synthesis(stepData) {
      if (stepData && stepData.businessErrors) {
        let previousForm = [];
        const currentForm = [
          stepData.creationAccountStep.company,
          stepData.creationAccountStep.siretValue,
          stepData.creationAccountStep.tvaValue,
          stepData.creationAccountStep.login,
        ];

        for (const key in stepData.businessErrors) {
          previousForm.push(stepData.businessErrors[key]);
        }

        let foundErrors = previousForm.filter((pf) => currentForm.find((cf) => cf === pf));

        if (foundErrors.length) {
          this.isError = true;
        } else {
          this.isError = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.creation-panel {
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  width: 100%;
  overflow: auto;

  .stepper-container {
    // .account-creation-stepper
    // display: flex;
    // justify-content: center;
    // margin-top: 1rem;
    width: 70%;
    background: white;
    overflow: auto;
    padding: 1rem;
    display: flex;
    flex-flow: column nowrap;
    height: 100%;

    .pb8 {
      padding-bottom: 8rem !important;
    }

    .account-creation-stepper {
      height: 100%;
      padding: 0;

      .step-container {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    }
  }
  .wizard-synthesis {
    width: 30%;
    background: #f1f1f1;
    overflow: auto;
    padding: 1rem;
    position: relative;

    .loader {
      z-index: 100;
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .skeleton-line {
      width: 100px;
      height: 10px;
    }
  }
}
@media screen and (max-width: 900px) {
  .cd-panel__container {
    width: 100%;
    left: 0;
  }
  .creation-panel {
    width: 100%;
    .stepper-container {
      width: 100% !important;
      margin-top: 60px;
      .step-container {
        .container {
          max-width: 100%;
          width: 100%;
        }
      }
    }
  }

  .panelSynthesis {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
