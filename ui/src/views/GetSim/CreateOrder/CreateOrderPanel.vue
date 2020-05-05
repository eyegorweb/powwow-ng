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
        />
      </div>
    </div>
    <div class="orderSynthesis">
      <GetSimCreateOrderPanelSynthesis
        :synthesis="synthesis"
        :can-save="currentStep === steps.length - 1"
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
    };
  },

  computed: mapState({
    orders: state => {
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
    ...mapMutations(['openPanel', 'closePanel']),
    ...mapMutations('getsim', ['refreshIndicators']),
    ...mapActions('getsim', ['resetOrderFilters']),

    prefillServices() {
      // Assemble services
      const preActivation = this.order.preActivationAsked;
      const activation = this.order.activationAsked;
      const offerCode = this.order.orderedMarketingOffer.code;

      const offerServices = getMarketingOfferServices(this.order);

      const servicesChoice = {
        services: offerServices.filter(f => f.code !== 'DATA'),
        dataService: offerServices.find(f => f.code == 'DATA'),
      };

      this.synthesis = {
        ...this.synthesis,
        services: {
          label: 'common.services',
          value: {
            id: 'common.services',
            content: [
              `Offre:  ${activation ? this.order.initialOffer.description : ''}`,
              `Activation: ${activation ? 'Oui' : 'Non'}`,
              `Préactivation: ${preActivation ? 'Oui' : 'Non'}`,
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
      this.saveSynthesis(payload);
      this.currentStep++;
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
    async saveOrder() {
      this.checkForErrors();
      if (!this.orderReferenceError && !this.customFieldsErrors.length) {
        const response = await createOrder(this.synthesis);
        if (!response.errors) {
          this.closePanel();
          this.resetOrderFilters();
          this.openPanelForSavedOrder(response.id);
          this.refreshIndicators();
        } else {
          const errors = response.errors;
          if (errors.length && errors[0].extensions && errors[0].extensions.externalId) {
            this.orderReferenceError = 'getsim.errors.' + errors[0].extensions.externalId;
          }
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
      const getValueForField = code => {
        const found = this.customFieldsMeta.values.find(v => v.code === code);
        if (found) {
          return found.enteredValue;
        }
      };

      this.customFieldsErrors = this.customFieldsMeta.all
        .filter(c => !c.isOptional)
        .filter(c => {
          const value = getValueForField(c.code);
          if (!value || value.length === 0) {
            return true;
          }
        })
        .map(c => c.code);

      const isOrderNumberMandatory = get(
        this.synthesis,
        'billingAccount.selection.partner.orderNumberIsMandatory',
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
  }
}
</style>
