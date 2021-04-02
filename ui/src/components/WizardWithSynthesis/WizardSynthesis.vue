<template>
  <div class="wizard-synthesis-wrapper">
    <h6>{{ $t(title) }}</h6>
    <div class="synthesis-content">
      <CreateOrderPanelSynthesisItem
        :key="item.label"
        v-for="item in formattedItems"
        :item="item"
      />
    </div>
    <div class="footer pt-3" v-if="canSave">
      <UiCheckbox v-model="accept" :disabled="!canSave">{{
        $t('orders.new.acceptConditions')
      }}</UiCheckbox>
      <button
        type="button"
        class="btn btn-accent btn-lg btn-block mt-1"
        :disabled="!(accept && canSave)"
        @click="$emit('save', synthesis)"
      >
        {{ $t('getsim.reservations.save') }}
      </button>
    </div>
  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';
import CreateOrderPanelSynthesisItem from '@/views/GetSim/CreateOrder/CreateOrderPanelSynthesisItem.vue';

export default {
  components: {
    UiCheckbox,
    CreateOrderPanelSynthesisItem,
  },
  props: {
    title: String,
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

  computed: {
    formattedItems() {
      const formatted = [];

      if (this.$loGet(this.synthesis, 'stepClient.billingAccount.label')) {
        formatted.push({
          label: 'common.billingAccount',
          value: {
            content: this.$loGet(this.synthesis, 'stepClient.billingAccount.label'),
          },
        });
      }

      if (this.$loGet(this.synthesis, 'stepProduct.simCard')) {
        formatted.push({
          label: 'common.product',
          value: {
            content: this.$loGet(this.synthesis, 'stepProduct.simCard.name'),
          },
        });

        formatted.push({
          label: 'getsim.nb-of-sim',
          value: {
            content: this.$loGet(this.synthesis, 'stepProduct.quantity'),
          },
        });

        if (this.$loGet(this.synthesis, 'stepProduct.selectedSimIsOfTapeType')) {
          formatted.push({
            label: 'getsim.nb-of-tapes',
            value: {
              content: this.$loGet(this.synthesis, 'stepProduct.simCard.number'),
            },
          });
        }

        if (this.$loGet(this.synthesis, 'serviceStep')) {
          formatted.push({
            label: 'common.services',
            value: {
              content: [
                `${this.$t('col.offer')}: ${this.$loGet(
                  this.synthesis,
                  'serviceStep.selectedOffer.workflowDescription',
                  ' -'
                )}`,
                `${this.$t('col.activationAsked')}: ${
                  this.$loGet(this.synthesis, 'serviceStep.activation')
                    ? this.$t('common.YES')
                    : this.$t('common.NO')
                }`,
                `${this.$t('col.preActivationAsked')}: ${
                  this.$loGet(this.synthesis, 'serviceStep.preActivation')
                    ? this.$t('common.YES')
                    : this.$t('common.NO')
                }`,
              ],
            },
          });
        }

        if (this.$loGet(this.synthesis, 'pairing.profile')) {
          formatted.push({
            label: 'getsim.reservations.creation.pairing',
            value: {
              content: [
                `${this.$t('getsim.reservations.creation.profileSelect')}: ${this.$t(
                  this.$loGet(this.synthesis, 'pairing.profile.label')
                )}`,
              ],
            },
          });
        }
      }

      return formatted;
    },
  },
};
</script>

<style scoped lang="scss">
.wizard-synthesis-wrapper {
  padding: 1em !important;
  display: flex;
  flex-direction: column;
  height: 100%;
  .synthesis-content {
    overflow-y: auto;
    flex-grow: 1;
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
  .wizard-synthesis-wrapper {
    .footer /deep/ label {
      padding-top: 0;
      font-size: 0.9rem;
    }
  }
}

@media (max-height: 588px) {
  .wizard-synthesis-wrapper {
    .footer /deep/ label {
      padding-top: 10px;
      font-size: 0.9rem;
    }
  }
}
</style>
