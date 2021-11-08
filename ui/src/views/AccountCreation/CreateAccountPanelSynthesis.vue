<template>
  <div class="new-digital-offer-synthesis">
    <h6>{{ $t('digitalOffer.synthesis.title') }}</h6>
    <div class="synthesis-content">
      <CreateAccountPanelSynthesisItem
        :key="item.label"
        v-for="item in formattedItems"
        :item="item"
      />
      <hr class="separator" />
      <div v-if="total">
        <div class="total">
          <span class="flex-grow-1">{{ formattedTotal }}</span>
          <span>{{ total }} €</span>
        </div>
      </div>
    </div>
    <div class="footer pt-3" v-if="canSave">
      <button
        type="button"
        class="btn btn-accent btn-lg btn-block mt-1"
        :disabled="!canSave"
        @click="$emit('save')"
      >
        {{ $t('orders.new.save') }}
      </button>
    </div>
  </div>
</template>

<script>
import CreateAccountPanelSynthesisItem from '@/views/GetSim/CreateOrder/CreateOrderPanelSynthesisItem.vue';

export default {
  components: {
    CreateAccountPanelSynthesisItem,
  },
  props: {
    synthesis: {
      type: Object,
      required: true,
    },
    canSave: Boolean,
  },

  computed: {
    formattedItems() {
      const formatted = [];

      if (this.$loGet(this.synthesis, 'creationAccountStep')) {
        if (this.$loGet(this.synthesis, 'creationAccountStep.companyName')) {
          formatted.push({
            label: 'digitalOffer.synthesis.company',
            value: {
              content: this.$loGet(this.synthesis, 'creationAccountStep.companyName'),
            },
          });

          if (this.$loGet(this.synthesis, 'creationAccountStep.address')) {
            formatted.push({
              label: 'digitalOffer.synthesis.billingAddress',
              value: {
                content: [
                  `${this.$loGet(this.synthesis, 'creationAccountStep.address', ' -')}`,
                  `${this.$loGet(this.synthesis, 'creationAccountStep.email', '-')}`,
                  `${this.$loGet(this.synthesis, 'creationAccountStep.phone', '-')}`,
                ],
              },
            });
          }
        }
      }

      if (this.$loGet(this.synthesis, 'offerStep')) {
        if (this.$loGet(this.synthesis, 'offerStep.name')) {
          formatted.push({
            label: 'digitalOffer.offer',
            value: {
              content: this.$loGet(this.synthesis, 'offerStep.name'),
            },
          });
        }
        // if (this.$loGet(this.synthesis, 'offerStep.price')) {
        //   formatted.push({
        //     label: 'digitalOffer.synthesis.price',
        //     value: {
        //       content: this.$loGet(this.synthesis, 'offerStep.price'),
        //     },
        //   });
        // }
      }

      if (this.$loGet(this.synthesis, 'simStep')) {
        if (this.$loGet(this.synthesis, 'simStep.selectedSimTypeValue')) {
          formatted.push({
            label: 'digitalOffer.simType',
            value: {
              content: this.$loGet(this.synthesis, 'simStep.selectedSimTypeValue.simCard.name'),
            },
          });
        }
      }

      if (this.$loGet(this.synthesis, 'offerStep')) {
        if (this.$loGet(this.synthesis, 'offerStep.price')) {
          formatted.push({
            label: 'digitalOffer.synthesis.price',
            value: {
              content: this.$loGet(this.synthesis, 'offerStep.price') + ' €',
            },
          });
        }
      }

      if (this.$loGet(this.synthesis, 'simStep')) {
        if (this.$loGet(this.synthesis, 'simStep.selectedNumberOfSims')) {
          formatted.push({
            label: 'common.quantity',
            value: {
              content: this.$loGet(this.synthesis, 'simStep.selectedNumberOfSims'),
            },
          });
        }
      }

      return formatted;
    },

    total() {
      const quantity = this.$loGet(this.synthesis, 'simStep.selectedNumberOfSims', 0);
      const price = this.$loGet(this.synthesis, 'offerStep.price', 0);
      if (!quantity) return false;
      return price * quantity;
    },

    formattedTotal() {
      return this.$t('total').toUpperCase();
    },
  },
};
</script>

<style scoped lang="scss">
$fontSize: 0.8rem;
.new-digital-offer-synthesis {
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
    button {
      font-size: 1rem;
    }
  }
  .separator {
    border: 1px solid #000;
  }
  div.total {
    font-size: $fontSize;
    display: flex;
    flex-direction: row;
  }
}

@media screen and (max-height: 768px) {
  .new-digital-offer-synthesis {
    .footer ::v-deep label {
      padding-top: 10px;
      font-size: 0.9rem;
    }
  }
}

@media (max-height: 588px) {
  .new-digital-offer-synthesis {
    .footer ::v-deep label {
      padding-top: 10px;
      font-size: 0.9rem;
    }
  }
}
</style>
