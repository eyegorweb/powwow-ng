<template>
  <div class="orderCreationPanel">
    <div class="orderStep">
      <div class="steps">
        <Stepper :key="$i18n.locale" :steps="steps" :selected-index="currentStep" />
      </div>
      <div class="stepContent">
        <CreateOrderStepClient
          v-if="currentStep === 0"
          :synthesis="synthesis"
          :order="order"
          @done="stepisDone"
          @saveSynthesis="saveSynthesis"
        />
        <CreateOrderStepProduct
          v-if="currentStep === 1"
          :synthesis="synthesis"
          :order="order"
          @done="stepisDone"
          @prev="previousStep"
          @saveSynthesis="saveSynthesis"
        />
        <CreateOrderStepServices
          v-if="currentStep === 2"
          @done="stepisDone"
          @prev="previousStep"
          @saveSynthesis="saveSynthesis"
          :synthesis="synthesis"
          :order="order"
        />
        <CreateOrderStepDelivery
          v-if="currentStep === 3"
          :synthesis="synthesis"
          :order="order"
          @done="stepisDone"
          @prev="previousStep"
        />
        <CreateOrderStepSettings
          v-if="currentStep === 4"
          :synthesis="synthesis"
          :custom-fields-errors="customFieldsErrors"
          :order-reference-error="orderReferenceError"
          :order="order"
          @prev="previousStep"
          @done="lastStep"
          @customFieldsMeta="setCustomFieldsMeta"
          @saveSynthesis="saveSynthesis"
          @validated="validateCreateOrderStepSettingsStep"
        />
      </div>
    </div>
    <div class="orderSynthesis">
      <div class="loader" v-if="showLoader">
        <div class="skeleton-line"></div>
      </div>
      <GetSimCreateOrderPanelSynthesis
        :synthesis="synthesis"
        :can-save="currentStep === steps.length - 1 && createOrderStepSettingsIsValidated"
        @save="saveOrder"
      />
    </div>
  </div>
</template>

<script>
import Stepper from '@/components/ui/Stepper';
import GetSimCreateOrderPanelSynthesis from './CreateOrderPanelSynthesis';
import CreateOrderStepClient from './CreateOrderStepClient';
import CreateOrderStepProduct from './CreateOrderStepProduct';
import CreateOrderStepSettings from './StepSettings/CreateOrderStepSettings';
import CreateOrderStepDelivery from './DeliveryStep/CreateOrderStepDelivery';
import CreateOrderStepServices from './Services/CreateOrderStepServices';
import { createOrder, searchSingleOrder } from '@/api/orders';
import { mapMutations, mapState, mapActions } from 'vuex';
import { getMarketingOfferServices } from '@/components/Services/utils.js';

import get from 'lodash.get';

export default {
  components: {
    Stepper,
    GetSimCreateOrderPanelSynthesis,
    CreateOrderStepClient,
    CreateOrderStepProduct,
    CreateOrderStepSettings,
    CreateOrderStepDelivery,
    CreateOrderStepServices,
  },
  props: {
    isOpen: {
      type: Boolean,
    },
    order: Object, // Commande à dupliquer
  },
  watch: {
    isOpen() {
      this.reset();
    },
  },

  data() {
    return {
      steps: [
        { label: this.$t('orders.new.customer') },
        { label: this.$t('orders.new.product') },
        { label: this.$t('orders.new.service') },
        { label: this.$t('orders.new.delivery') },
        { label: this.$t('orders.new.settings') },
      ],

      currentStep: 0,
      synthesis: {},
      customFieldsMeta: [],
      customFieldsErrors: undefined,
      orderReferenceError: undefined,
      showLoader: false,
      createOrderStepSettingsIsValidated: true,
    };
  },

  computed: mapState({
    orders: (state) => {
      return get(state, 'filters.ordersResponse.items', []);
    },
  }),

  created() {
    /**
    En cas de duplication pré remplir la synthèse avec les données de la commande à dupliquer
    */
    if (this.order) {
      this.prefillServices();
    }
  },

  methods: {
    ...mapMutations(['openPanel', 'closePanel', 'confirmAction']),
    ...mapMutations('getsim', ['refreshIndicators']),
    ...mapActions('getsim', ['resetOrderFilters']),

    prefillServices() {
      // Assemble services
      const preActivation = this.order.preActivationAsked;
      const activation = this.order.activationAsked;
      const offerCode = this.$loGet(this.order, 'orderedMarketingOffer.code');

      const offerServices = getMarketingOfferServices(this.order);

      const servicesChoice = {
        services: offerServices.filter((f) => f.code !== 'DATA' && f.type !== 'UPF'),
        dataService: offerServices.find((f) => f.code == 'DATA'),
        upfService: offerServices.find((f) => f.type == 'UPF'),
      };

      this.synthesis = {
        ...this.synthesis,
        services: {
          label: 'common.services',
          value: {
            id: 'common.services',
            content: [
              `${this.$t('col.offer')}:  ${
                activation ? this.$loGet(this.order, 'initialOffer.description') : ''
              }`,
              `${this.$t('col.activationAsked')}: ${
                activation ? this.$t('common.YES') : this.$t('common.NO')
              }`,
              `${this.$t('col.preActivationAsked')}: ${
                preActivation ? this.$t('common.YES') : this.$t('common.NO')
              }`,
            ],
            activation,
            preActivation,
            // selectedOffer: this.selectedOffer,
            offerCode,
            servicesChoice,
          },
          selection: {
            activation: !!activation,
            preActivation: !!preActivation,
          },
        },
      };
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
      if (payload.needToConfirm && payload.needToConfirm.length > 0) {
        this.confirmAction({
          message: payload.message,
          listStyle: !!payload.message,
          actionFn: async () => {
            this.saveSynthesis(payload);
          },
          doAfterFn: () => {
            this.currentStep++;
          },
        });
      } else {
        this.saveSynthesis(payload);
        this.currentStep++;
      }
    },
    saveSynthesis(payload) {
      this.synthesis = {
        ...this.synthesis,
        ...payload,
      };
    },

    lastStep(payload) {
      this.saveSynthesis(payload);
    },

    validateCreateOrderStepSettingsStep(isValid) {
      this.createOrderStepSettingsIsValidated = isValid;
    },
    async saveOrder() {
      this.checkForErrors();
      if (!this.orderReferenceError && !this.customFieldsErrors.length) {
        this.showLoader = true;
        const response = await createOrder(this.synthesis);
        if (!response.errors) {
          this.closePanel();
          this.resetOrderFilters();
          this.openPanelForSavedOrder(response.id);
          this.refreshIndicators();
          this.showLoader = false;
        } else {
          const errors = response.errors;
          if (errors.length && errors[0].extensions && errors[0].extensions.externalId) {
            this.orderReferenceError = 'getsim.errors.' + errors[0].extensions.externalId;
          }
          this.showLoader = false;
        }
      }
    },

    async openPanelForSavedOrder(savedOrderId) {
      const title = this.$t('getsim.details.title', { id: savedOrderId });
      const order = await searchSingleOrder(savedOrderId);
      if (order) {
        setTimeout(() => {
          this.openPanel({
            title,
            panelId: 'getsim.details.title',
            payload: { isNew: true, ...order },
            wide: false,
          });
        }, 500);
      }
    },
    /**
     * On a besoin des métadata des custom fields pour savoir quel champ est obligatoire
     */
    setCustomFieldsMeta(m) {
      this.customFieldsMeta = m;
    },
    checkForErrors() {
      this.orderReferenceError = undefined;
      const getValueForField = (code) => {
        const found = this.customFieldsMeta.values.find((v) => v.code === code);
        if (found) {
          return found.enteredValue;
        }
      };

      this.customFieldsErrors = this.customFieldsMeta.all
        .filter((c) => !c.isOptional)
        .filter((c) => {
          const value = getValueForField(c.code);
          if (!value || value.length === 0) {
            return true;
          }
        })
        .map((c) => c.code);

      const isOrderNumberMandatory = get(
        this.synthesis,
        'billingAccount.selection.partner.options.orderNumberRequired',
        false
      );

      if (isOrderNumberMandatory) {
        const orderRefContent = get(this.synthesis, 'orderReference.value.content');
        this.orderReferenceError = orderRefContent ? undefined : 'errors.mandatory';
      } else {
        this.orderReferenceError = undefined;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  background: #fff;
}

.orderCreationPanel {
  display: flex;
  flex-flow: row nowrap;
  height: 100%;

  .orderStep {
    width: 70%;
    background: white;
    overflow: auto;
    padding: 1rem;
    display: flex;
    flex-flow: column nowrap;
    height: 100%;

    .steps {
      flex-basis: 4rem;
    }

    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
      .steps {
        overflow: hidden;
      }
    }

    .stepContent {
      flex-grow: 1;
    }
  }

  .orderSynthesis {
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
