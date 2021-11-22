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
        >
          <template slot="errors">
            <div v-if="requestErrors || businessErrors" class="alert alert-danger" role="alert">
              <ul>
                <li v-for="e in businessErrors" :key="e">{{ $t('digitalOffer.errors.' + e) }}</li>
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
import { createAccount, validateAccount } from '@/api/digital.js';
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
    this.$router.push({ name: 'createAccount.partner' });
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
      requestErrors: undefined,
      businessErrors: undefined,
      report: undefined,
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
            country: this.$loGet(this.synthesis, 'deliveryStep.country.code'),
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
      };
      this.isLoading = true;
      try {
        const response = await createAccount(this.formattedData);
        this.isLoading = false;
        console.log('response create account >>>>>>>>>>', response);
        this.checkErrors(response);
        // redirection paynum
        if (response && response.url) {
          this.redirectToPaynum(response.url);
        }

        // validation de la création de compte après paiement
        // if (response && response.paymentId) {
        //   this.validate(response.paymentId);
        // }
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
        this.businessErrors = response.errors;
        this.isError = true;
      }
      if (response && response.inputErrors) {
        this.requestErrors = response.inputErrors;
        this.isError = true;
      }
      return this.isError;
    },

    redirectToPaynum(paynumUrl) {
      // const targetUrl = `${this.authUrl}/oauth/authorize?response_type=token&client_id=${process.env.VUE_APP_CLIENT_ID}&redirect_uri=${window.location.origin}${process.env.VUE_APP_BASE_URL}/callback&prev=${this.currentUrl}`;
      redirectTo(paynumUrl);
    },

    async validate(paymentId) {
      if (this.isError) return;
      if (paymentId) {
        return await validateAccount(paymentId);
      }
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
</style>
