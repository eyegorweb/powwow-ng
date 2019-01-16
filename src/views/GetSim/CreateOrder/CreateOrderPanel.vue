<template>
  <SlidePanel
    title="getsim.order-sim"
    :is-open="isOpen"
    @close="close"
    wide
  >
    <div v-if="isOpen" class="row panel-container">
      <div class="col-md-8 content">
        <Stepper :key="$i18n.locale" :steps="steps" :selected-index="currentStep">
          <div slot="Client">
            <CreateOrderStepClient @client-step-done="clientStepIsDone" />
          </div>
          <p slot="Produit">liste des sims ici</p>
          <p slot="Livraison">Livraison</p>
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

// import UiButton from '@/components/ui/Button';

export default {
  components: {
    SlidePanel,
    Stepper,
    GetSimCreateOrderPanelSynthesis,
    CreateOrderStepClient,
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
    clientStepIsDone(payload) {
      this.synthesis = {
        ...this.synthesis,
        billingAccount: payload,
      };
      this.currentStep += 1;
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
