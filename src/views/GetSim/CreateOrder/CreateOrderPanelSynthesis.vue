<template>
  <div class="new-order-synthesis">
    <h6>{{ $t('orders.new.synthesis') }}</h6>
    <div>
      <GetSimCreateOrderPanelSynthesisItem :item="synthesis.billingAccount" />
      <GetSimCreateOrderPanelSynthesisItem :item="synthesis.product" />
      <GetSimCreateOrderPanelSynthesisItem :item="synthesis.quantity" />
      <GetSimCreateOrderPanelSynthesisItem :item="synthesis.services" />
      <GetSimCreateOrderPanelSynthesisItem :item="synthesis.delivery" />
      <GetSimCreateOrderPanelSynthesisItem :item="synthesis.settings" />
    </div>
  </div>
</template>

<script>
import GetSimCreateOrderPanelSynthesisItem from './CreateOrderPanelSynthesisItem';

export default {
  components: {
    GetSimCreateOrderPanelSynthesisItem,
  },
  props: {
    synthesis: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.new-order-synthesis {
  padding: 1em !important;
  h6 {
    margin-bottom: 2em;
  }
}
</style>
