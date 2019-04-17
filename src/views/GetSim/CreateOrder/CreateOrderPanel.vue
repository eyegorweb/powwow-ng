<template>
  <div class="row">
    <div class="col-md-8 content">
      <Stepper :key="$i18n.locale" :steps="steps" :selected-index="currentStep">
        <div slot="Client">
          <CreateOrderStepClient
            :synthesis="synthesis"
            :order="order"
            @done="stepisDone"
            @saveSynthesis="saveSynthesis"
          />
        </div>
        <div slot="Produit">
          <CreateOrderStepProduct
            :synthesis="synthesis"
            :order="order"
            @done="stepisDone"
            @prev="previousStep"
            @saveSynthesis="saveSynthesis"
          />
        </div>
        <div slot="Services">
          <CreateOrderStepServices @done="stepisDone" @prev="previousStep" :synthesis="synthesis" />
        </div>
        <div slot="Livraison">
          <CreateOrderStepDelivery
            :synthesis="synthesis"
            :order="order"
            @done="stepisDone"
            @prev="previousStep"
          />
        </div>
        <div slot="Paramètres">
          <CreateOrderStepSettings
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
      </Stepper>
    </div>
    <div class="col-md-4 synthesis-bar">
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
import { mapMutations, mapState } from 'vuex';
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
      // Assemble adress
      const adressOrder = [];

      if (this.order.name) {
        adressOrder.push(this.order.name.firstName + ' ' + this.order.name.lastName);
      }

      adressOrder.push(this.order.address.address1);

      if (this.order.address.address2 && this.order.address.address2 !== 'null') {
        adressOrder.push(this.order.address.address2);
      }

      if (this.order.address.address3 && this.order.address.address3 !== 'null') {
        adressOrder.push(this.order.address.address3);
      }

      adressOrder.push(this.order.address.zipCode + ' - ' + this.order.address.city);
      if (this.order.contactInformation) {
        adressOrder.push(this.order.contactInformation.email);
        adressOrder.push(this.order.contactInformation.phone);
      }
    }
  },

  methods: {
    ...mapMutations(['openPanel', 'closePanel']),
    ...mapMutations('getsim', ['clearAllFilters']),

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
          this.clearAllFilters();
          this.openPanelForSavedOrder(response.id);
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
        .filter(c => c.mandatory === 'ORDER')
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
.synthesis-bar {
  height: 100%;
  background: #f3f3f3;
}
</style>
