<template>
  <div class="row">
    <div class="col-md-8 content">
      <Stepper :key="$i18n.locale" :steps="steps" :selected-index="currentStep">
        <div slot="Client">
          <CreateOrderStepClient @done="stepisDone" :synthesis="synthesis" />
        </div>
        <div slot="Produit">
          <CreateOrderStepProduct @done="stepisDone" @prev="previousStep" :synthesis="synthesis" />
        </div>
        <div slot="Services">
          <CreateOrderStepServices :offers="offers" :apn="apn" @done="stepisDone" @prev="previousStep" :synthesis="synthesis" />
        </div>
        <div slot="Livraison">
          <CreateOrderStepDelivery @done="stepisDone" @prev="previousStep" :synthesis="synthesis" />
        </div>
        <div slot="Paramètres">
          <CreateOrderStepSettings @prev="previousStep" @done="lastStep" :synthesis="synthesis" @customFieldsMeta="setCustomFieldsMeta" :custom-fields-errors="customFieldsErrors" />
        </div>
      </Stepper>
    </div>
    <div class="col-md-4 synthesis-bar">
      <GetSimCreateOrderPanelSynthesis :synthesis="synthesis" :can-save="currentStep === steps.length - 1" @save="saveOrder" />
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
import { createOrder } from '@/api/orders';
import { mapActions, mapMutations, mapState } from 'vuex';
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
      offers: ['LEBARA 3G SERVICES', 'LEBARA 4G SERVICES', 'LEBARA DATA'],
      apn: [
        'Linkybouygues01.fr',
        'Linkybouygues02.fr',
        'Linkybouygues03.fr',
        'Linkybouygues04.fr',
        'Linkybouygues05.fr',
        'Linkybouygues06.fr',
        'Linkybouygues07.fr',
        'Linkybouygues08.fr',
        'Linkybouygues09.fr',
      ],
    };
  },

  computed: mapState({
    orders: state => get(state, 'filters.ordersResponse.items', []),
  }),

  methods: {
    ...mapActions(['fetchOrdersFromApi']),
    ...mapMutations(['openPanel', 'closePanel', 'clearAllFilters']),
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
      if (!this.customFieldsErrors.length) {
        const { id } = await createOrder(this.synthesis);
        await this.fetchOrdersFromApi({
          orderBy: { key: 'id', direction: 'DESC' },
          pageInfo: { page: 0, limit: 20 },
          appliedFilters: [],
        });
        this.closePanel();
        this.clearAllFilters();
        this.openPanelForSavedOrder(id);
      }
    },

    openPanelForSavedOrder(savedOrderId) {
      const order = this.orders.find(o => o.id === savedOrderId);
      if (order) {
        const title = this.$t('getsim.details.title', { id: savedOrderId });
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
