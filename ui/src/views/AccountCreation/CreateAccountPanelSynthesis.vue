<template>
  <div class="new-digital-offer-synthesis">
    <h6 class="title">{{ $t('digitalOffer.synthesis.title') }}</h6>
    <div class="synthesis-content">
      <CreateAccountPanelSynthesisItem
        :key="item.label"
        v-for="item in formattedItems"
        :item="item"
      />
      <div class="synthesis-item table-price d-flex flex-row" v-if="displayTotal">
        <div class="flex-grow-1" v-if="$loGet(formattedPrice[0], 'label')">
          <h6 class="subtitle">
            {{ $loGet(formattedPrice[0], 'label') }}
          </h6>
          <p>{{ $loGet(formattedPrice[0], 'value.content', '-') }}</p>
        </div>
        <div v-if="$loGet(formattedPrice[1], 'label')">
          <h6 class="subtitle">
            {{ $loGet(formattedPrice[1], 'label') }}
          </h6>
          <p class="text-right">{{ $loGet(formattedPrice[1], 'value.content', '-') }} €</p>
        </div>
      </div>
      <hr class="separator" />
      <div v-if="total">
        <div class="total">
          <span class="flex-grow-1">{{ formattedTotal }}</span>
          <span>{{ total }} €</span>
        </div>
      </div>
    </div>
    <div class="footer pt-3" v-if="canSave">
      <slot name="errors"></slot>
      <button
        v-if="!isLoading"
        type="button"
        class="btn btn-accent btn-lg btn-block mt-1"
        :disabled="!canSave || isError"
        @click="$emit('save')"
      >
        {{ $t('orders.new.save') }}
      </button>
      <button class="btn btn-accent btn-lg btn-block mt-1" disabled v-if="isLoading">
        {{ $t('processing') }}...
        <CircleLoader />
      </button>
      <!-- <button
        v-if="isSuccess && !isLoading"
        @click="$emit('confirm')"
        class="btn btn-block btn-success"
      >
        <span>{{ $t('confirm') }}</span>
      </button> -->
    </div>
  </div>
</template>

<script>
import CreateAccountPanelSynthesisItem from '@/views/GetSim/CreateOrder/CreateOrderPanelSynthesisItem.vue';
import CircleLoader from '@/components/ui/CircleLoader';

export default {
  components: {
    CreateAccountPanelSynthesisItem,
    CircleLoader,
  },
  props: {
    synthesis: {
      type: Object,
      required: true,
    },
    canSave: Boolean,
    isLoading: Boolean,
    isError: Boolean,
    // isSuccess: Boolean,
  },

  computed: {
    formattedItems() {
      const formatted = [];
      if (this.$loGet(this.synthesis, 'creationAccountStep')) {
        if (this.$loGet(this.synthesis, 'creationAccountStep.company')) {
          formatted.push({
            label: 'digitalOffer.synthesis.company',
            value: {
              content: this.$loGet(this.synthesis, 'creationAccountStep.company'),
            },
          });

          if (this.$loGet(this.synthesis, 'creationAccountStep.address')) {
            const civility = `${this.$loGet(this.synthesis, 'creationAccountStep.title', '')}`;
            const assembledCivility = `${this.$t('common.' + civility)} ${this.$loGet(
              this.synthesis,
              'creationAccountStep.firstName',
              ''
            )} ${this.$loGet(this.synthesis, 'creationAccountStep.lastName', '')}`;
            const assembledCityAddress = `${this.$loGet(
              this.synthesis,
              'creationAccountStep.zipCode',
              '-'
            )} - ${this.$loGet(this.synthesis, 'creationAccountStep.city', '-')}`;
            formatted.push({
              label: 'digitalOffer.synthesis.billingAddress',
              value: {
                content: [
                  assembledCivility,
                  `${this.$loGet(this.synthesis, 'creationAccountStep.address', '-')}`,
                  assembledCityAddress,
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
      return formatted;
    },

    formattedPrice() {
      const formatted = [];
      if (this.$loGet(this.synthesis, 'simStep')) {
        if (this.$loGet(this.synthesis, 'simStep.selectedNumberOfSims')) {
          formatted.push({
            label: this.$t('common.quantity'),
            value: {
              content: this.$loGet(this.synthesis, 'simStep.selectedNumberOfSims'),
            },
          });
        }
      }

      if (this.$loGet(this.synthesis, 'offerStep')) {
        if (this.$loGet(this.synthesis, 'offerStep.initialOffer')) {
          formatted.push({
            label: this.$t('digitalOffer.synthesis.price'),
            value: {
              content: this.price,
            },
          });
        }
      }

      return formatted;
    },

    price() {
      const price = this.$loGet(
        this.synthesis,
        'offerStep.initialOffer.buyingPriceInEuroCentTTC',
        0
      );
      return price / 100;
    },

    total() {
      const quantity = this.$loGet(this.synthesis, 'simStep.selectedNumberOfSims', 0);
      const price = this.$loGet(
        this.synthesis,
        'offerStep.initialOffer.buyingPriceInEuroCentTTC',
        0
      );
      if (!quantity) return false;
      return (price * quantity) / 100;
    },

    formattedTotal() {
      return `${this.$t('total').toUpperCase()} TTC`;
    },

    displayTotal() {
      return this.formattedPrice[0] && this.formattedPrice[0].label === this.$t('common.quantity');
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
    &.title {
      margin-bottom: 2em;
    }
    &.subtitle {
      color: $gray-680;
      font-size: $fontSize;
      font-weight: 500;
    }
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
