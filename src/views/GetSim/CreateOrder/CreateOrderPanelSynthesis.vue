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
      <UiCheckbox v-model="accept" :disabled="!canSave">
        {{ $t('orders.new.acceptConditions') }}
      </UiCheckbox>
      <button
        type="button"
        class="btn btn-accent btn-lg btn-block mt-1"
        :disabled="!(accept && canSave)"
        @click="$emit('save')"
      >
        {{ $t('orders.new.save') }}
      </button>
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
    min-height: 73vh;
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
      min-height: 75vh;
      max-height: 75vh;
    }
    .footer /deep/ label {
      padding-top: 10px;
      font-size: 0.9rem;
    }
  }
}
</style>
