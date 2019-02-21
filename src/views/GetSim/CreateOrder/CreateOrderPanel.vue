<template>
  <div class="row">
    <div class="col-md-8 content">
      <Stepper :key="$i18n.locale" :steps="steps" :selected-index="currentStep">
        <div slot="Client">
          <CreateOrderStepClient @done="stepisDone" />
        </div>
        <div slot="Produit">
          <CreateOrderStepProduct @done="stepisDone" @prev="currentStep--" :synthesis="synthesis" />
        </div>
        <div slot="Livraison">
          <CreateOrderStepDelivery @done="stepisDone" @prev="currentStep--" :synthesis="synthesis" />
        </div>
        <div slot="Services">
          <CreateOrderStepServices :offers="offers" :apn="apn" @done="stepisDone" @prev="currentStep--" />
        </div>
        <div slot="Paramètres">
          <CreateOrderStepSettings @prev="currentStep--" @done="lastStep" :synthesis="synthesis" />
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
import CreateOrderStepServices from './CreateOrderStepServices';
import { createOrder } from '@/api/orders';
import { mapActions, mapMutations } from 'vuex';

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

  methods: {
    ...mapActions(['fetchOrdersFromApi']),
    ...mapMutations(['closePanel']),
    reset() {
      this.currentStep = 0;
      this.synthesis = {};
    },

    stepisDone(payload) {
      this.synthesis = {
        ...this.synthesis,
        ...payload,
      };
      this.currentStep++;
    },

    lastStep(payload) {
      this.synthesis = {
        ...this.synthesis,
        ...payload,
      };
    },
    async saveOrder() {
      await createOrder(this.synthesis);
      await this.fetchOrdersFromApi({
        orderBy: { key: 'id', direction: 'DESC' },
        pageInfo: { page: 0, limit: 20 },
        appliedFilters: [],
      });
      this.closePanel();
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
