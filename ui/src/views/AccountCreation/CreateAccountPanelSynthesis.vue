<template>
  <div class="new-digital-offer-synthesis">
    <h6 class="title">{{ $t('digitalOffer.synthesis.title') }}</h6>
    <div class="synthesis-content">
      <CreateAccountPanelSynthesisItem
        :key="item.label"
        v-for="item in formattedItems"
        :item="item"
      />
      <template v-if="displayTotal">
        <div class="synthesis-item table-price d-flex flex-row">
          <div class="flex-grow-1">
            <h6 class="subtitle">{{ $t('digitalOffer.synthesis.designation') }}</h6>
            <p>SIM</p>
          </div>
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
            <p class="text-right">
              {{ formatCurrency($loGet(formattedPrice[1], 'value.content')) }} €
            </p>
          </div>
        </div>
        <div class="synthesis-item table-price d-flex flex-row">
          <div class="flex-grow-1">
            <p>{{ $t('digitalOffer.synthesis.topup') }}</p>
          </div>
          <div class="flex-grow-1" v-if="$loGet(formattedPrice[0], 'label')">
            <p>{{ $loGet(formattedPrice[0], 'value.content', '-') }}</p>
          </div>
          <div v-if="$loGet(formattedPrice[1], 'label')">
            <p class="text-right">{{ formatCurrency(formattedOfferPackagePrice) }} €</p>
          </div>
        </div>
      </template>
      <hr class="separator" />
      <div v-if="total">
        <div class="total">
          <span class="flex-grow-1">{{ formattedTotalHT }}</span>
          <span>{{ formatCurrency(totalHT) }} €</span>
        </div>
        <div class="total">
          <span class="flex-grow-1">{{ formattedTotalTVA }}</span>
          <span>{{ formatCurrency(totalTVA) }} €</span>
        </div>
        <div class="total">
          <span class="flex-grow-1">{{ $t('shippingCost') }}</span>
          <span>{{ formatCurrency(10) }} €</span>
        </div>
        <div class="total">
          <span class="flex-grow-1">{{ $t('shippingOfferedCost') }}</span>
          <span>- {{ formatCurrency(10) }} €</span>
        </div>
        <div class="total">
          <span class="flex-grow-1">{{ formattedTotalTTC }}</span>
          <span>{{ formatCurrency(total) }} €</span>
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
    </div>
  </div>
</template>

<script>
import CreateAccountPanelSynthesisItem from '@/views/GetSim/CreateOrder/CreateOrderPanelSynthesisItem.vue';
import CircleLoader from '@/components/ui/CircleLoader';
import { formatCurrency } from '@/utils/numbers.js';

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
          const licence = this.$loGet(
            this.synthesis,
            'simStep.selectedSimTypeValue.simCard.licence'
          )
            ? `${this.$t('getsim.sim-type-labels.licence')}: ${this.$loGet(
                this.synthesis,
                'simStep.selectedSimTypeValue.simCard.licence'
              )}`
            : '';
          const format = this.$loGet(this.synthesis, 'simStep.selectedSimTypeValue.simCard.format')
            ? `${this.$t('getsim.sim-type-labels.format')}: ${this.$loGet(
                this.synthesis,
                'simStep.selectedSimTypeValue.simCard.format'
              )}`
            : '';
          formatted.push({
            label: 'digitalOffer.simType',
            value: {
              content: [
                this.$loGet(this.synthesis, 'simStep.selectedSimTypeValue.simCard.name'),
                format,
                licence,
              ],
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

      if (this.$loGet(this.synthesis, 'simStep')) {
        formatted.push({
          label: this.$t('digitalOffer.synthesis.price'),
          value: {
            content: this.$loGet(
              this.synthesis,
              'simStep.selectedSimTypeValue.buyingPriceInEuroCentHT',
              0
            ),
          },
        });
      }

      return formatted;
    },

    formattedOfferPackagePrice() {
      const price = this.$loGet(
        this.synthesis,
        'offerStep.offerPackage[0].buyingPriceInEuroCentHT',
        0
      );
      return price / 100;
    },

    priceTTC() {
      const price = this.$loGet(
        this.synthesis,
        'offerStep.offerPackage[0].buyingPriceInEuroCentTTC',
        0
      );
      return price / 100;
    },

    priceHT() {
      const price = this.$loGet(
        this.synthesis,
        'offerStep.offerPackage[0].buyingPriceInEuroCentHT',
        0
      );
      return price / 100;
    },

    total() {
      // total TTC : nb SIM * (prix SIM TTC + prix enveloppe TTC)
      const quantity = this.$loGet(this.synthesis, 'simStep.selectedNumberOfSims', 0);
      const simPriceTTC = this.$loGet(
        this.synthesis,
        'simStep.selectedSimTypeValue.buyingPriceInEuroCentTTC',
        0
      );
      if (!quantity) return 0;
      return quantity * (this.priceTTC + simPriceTTC);
    },

    totalHT() {
      // total HT : nb SIM * (prix SIM HT + prix enveloppe HT)
      const quantity = this.$loGet(this.synthesis, 'simStep.selectedNumberOfSims', 0);
      const simPriceHT = this.$loGet(
        this.synthesis,
        'simStep.selectedSimTypeValue.buyingPriceInEuroCentHT',
        0
      );
      if (!quantity) return 0;
      return quantity * (this.priceHT + simPriceHT);
    },

    totalTVA() {
      return this.total - this.totalHT;
    },

    formattedTotalTTC() {
      return `${this.$t('total').toUpperCase()} TTC`;
    },

    formattedTotalHT() {
      return `${this.$t('total').toUpperCase()} HT`;
    },

    formattedTotalTVA() {
      return `${this.$t('bills.amount')} TVA`;
    },

    displayTotal() {
      return this.formattedPrice[0] && this.formattedPrice[0].label === this.$t('common.quantity');
    },
  },

  methods: {
    formatCurrency(value) {
      return formatCurrency(value);
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
