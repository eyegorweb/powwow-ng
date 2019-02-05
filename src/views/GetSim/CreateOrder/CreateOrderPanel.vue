<template>
  <SlidePanel title="getsim.order-sim" :is-open="isOpen" @close="close" wide>
    <div v-if="isOpen" class="row panel-container">
      <div class="col-md-8 content">
        <Stepper :key="$i18n.locale" :steps="steps" :selected-index="currentStep">
          <div slot="Client">
            <CreateOrderStepClient @done="stepisDone" />
          </div>
          <div slot="Produit">
            <CreateOrderStepProduct @done="stepisDone" @prev="currentStep--" />
          </div>
          <div slot="Livraison">
            <CreateOrderStepDelivery @done="stepisDone" @prev="currentStep--" />
          </div>
        </Stepper>
      </div>
      <div class="col-md-4 synthesis-bar">
        <GetSimCreateOrderPanelSynthesis :synthesis="synthesis" />
      </div>
    </div>
  </SlidePanel>
</template>

<script>
import SlidePanel from '@/components/SlidePanel';
import Stepper from '@/components/ui/Stepper';
import GetSimCreateOrderPanelSynthesis from './CreateOrderPanelSynthesis';
import CreateOrderStepClient from './CreateOrderStepClient';
import CreateOrderStepProduct from './CreateOrderStepProduct';
import CreateOrderStepDelivery from './CreateOrderStepDelivery';

// import UiButton from '@/components/ui/Button';

export default {
  components: {
    SlidePanel,
    Stepper,
    GetSimCreateOrderPanelSynthesis,
    CreateOrderStepClient,
    CreateOrderStepProduct,
    CreateOrderStepDelivery,
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
        { label: this.$t('orders.new.delivery') },
        { label: this.$t('orders.new.service') },
        { label: this.$t('orders.new.settings') },
      ],

      currentStep: 0,
      synthesis: {},
    };
  },

  methods: {
    reset() {
      this.currentStep = 0;
      this.synthesis = {};
    },
    saveChanges() {
      this.$emit('update:isOpen', false);
    },
    close() {
      this.$emit('update:isOpen', false);
    },
    stepisDone(payload) {
      this.synthesis = {
        ...this.synthesis,
        ...payload,
      };
      this.currentStep++;
    },
  },
};
</script>

<style scoped lang="scss">
.panel-container {
  height: 100%;
  margin: 0;
  padding-top: 57px;
  div {
    padding: 0;
  }
  .content {
    background: #fff;
  }
  .synthesis-bar {
    height: 100%;
    background: #f3f3f3;
  }
}
</style>
