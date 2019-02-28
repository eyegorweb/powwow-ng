<template>
  <div class="new-order-synthesis">
    <h6>{{ $t('orders.new.synthesis') }}</h6>
    <div class="synthesis-content">
      <GetSimCreateOrderPanelSynthesisItem :item="synthesis.billingAccount" />
      <GetSimCreateOrderPanelSynthesisItem :item="synthesis.product" />
      <GetSimCreateOrderPanelSynthesisItem :item="synthesis.quantity" />
      <GetSimCreateOrderPanelSynthesisItem :item="synthesis.services" />
      <GetSimCreateOrderPanelSynthesisItem :item="synthesis.delivery" />
      <GetSimCreateOrderPanelSynthesisItem :item="synthesis.orderReference" />
      <GetSimCreateOrderPanelSynthesisItem :item="synthesis.customFields" />
    </div>
    <div class="footer pt-3">
      <UiCheckbox
        v-model="accept"
        :disabled="!canSave"
      >{{ $t('orders.new.acceptConditions') }}</UiCheckbox>
      <button
        type="button"
        class="btn btn-accent btn-lg btn-block"
        :disabled="!(accept && canSave)"
        @click="$emit('save')"
      >{{ $t('orders.new.save') }}</button>
    </div>
  </div>
</template>

<script>
import GetSimCreateOrderPanelSynthesisItem from './CreateOrderPanelSynthesisItem';
import UiCheckbox from '@/components/ui/Checkbox';

export default {
  components: {
    GetSimCreateOrderPanelSynthesisItem,
    UiCheckbox,
  },
  props: {
    synthesis: {
      type: Object,
      required: true,
    },
    canSave: Boolean,
  },
  data() {
    return {
      accept: false,
    };
  },
};
</script>

<style scoped lang="scss">
.new-order-synthesis {
  padding: 1em !important;
  display: flex;
  flex-direction: column;
  .synthesis-content {
    flex: 1;
    overflow-y: auto;
  }
  h6 {
    margin-bottom: 2em;
  }
  .footer {
    border-top: 1px solid $gray-400;
    button {
      font-size: 1rem;
    }
  }
}

@media screen and (max-height: 768px) {
  .new-order-synthesis {
    div.synthesis-content {
      max-height: 23vh;
      min-height: 70vh;
    }
    .footer /deep/ label {
      font-size: 0.8rem;
    }
  }
}
@media screen and (min-height: 769px) {
  .new-order-synthesis {
    div.synthesis-content {
      max-height: 23vh;
      min-height: 73vh;
    }
  }
}
</style>
