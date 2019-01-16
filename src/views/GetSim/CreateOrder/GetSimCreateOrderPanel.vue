<template>
  <SlidePanel
    title="getsim.order-sim"
    :is-open="isOpen"
    @close="close"
    wide
  >
    <div class="row panel-container">
      <div class="col-md-8 content">
        <Stepper :key="$i18n.locale" :steps="steps" :selected-index="createOrderStep">
          <p slot="Client">Step Client</p>
          <p slot="Livraison">Livraison</p>
        </Stepper>

      </div>
      <div class="col-md-4 synthesis-bar">
        <GetSimCreateOrderPanelSynthesis />
      </div>
    </div>

  </SlidePanel>
</template>

<script>
import { mapGetters } from 'vuex';
import SlidePanel from '@/components/SlidePanel';
import Stepper from '@/components/ui/Stepper';
import GetSimCreateOrderPanelSynthesis from './GetSimCreateOrderPanelSynthesis';

// import UiButton from '@/components/ui/Button';

export default {
  components: {
    SlidePanel,
    Stepper,
    GetSimCreateOrderPanelSynthesis,
  },
  props: {
    isOpen: {
      type: Boolean,
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
    };
  },

  methods: {
    saveChanges() {
      this.$emit('update:isOpen', false);
    },
    close() {
      this.$emit('update:isOpen', false);
    },
  },
  computed: {
    ...mapGetters(['createOrderStep']),
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
