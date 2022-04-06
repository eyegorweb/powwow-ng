<template>
  <div class="wizard-synthesis-wrapper">
    <h6>{{ $t(title) }}</h6>
    <div class="synthesis-content">
      <CreateOrderPanelSynthesisItem
        :key="item.label"
        v-for="item in formattedItems"
        :item="item"
      />
      <template v-if="displayTotal">
        <div class="synthesis-item table-price d-flex flex-row">
          <div style="flex-basis: 42%">
            <h6 class="subtitle">{{ $t('digitalOffer.synthesis.designation') }}</h6>
            <p>SIM</p>
          </div>
          <div class="flex-grow-1" v-if="$loGet(formattedPrice[0], 'label')">
            <h6 class="subtitle">
              {{ $loGet(formattedPrice[0], 'label') }}
            </h6>
            <p class="pl-4">{{ $loGet(formattedPrice[0], 'value.content', '-') }}</p>
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
          <div style="flex-basis: 42%">
            <p>{{ $t('digitalOffer.synthesis.topup') }}</p>
          </div>
          <div class="flex-grow-1" v-if="$loGet(formattedPrice[0], 'label')">
            <p class="pl-4">{{ $loGet(formattedPrice[0], 'value.content', '-') }}</p>
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

    <div class="footer pt-3">
      <template v-if="isError">
        <slot name="errors"></slot>
      </template>
      <template v-if="canSave">
        <UiCheckbox v-model="accept" :disabled="!canSave">{{
          $t('orders.new.acceptConditions')
        }}</UiCheckbox>
        <button
          v-if="!isLoading"
          type="button"
          class="btn btn-accent btn-lg btn-block mt-1"
          :disabled="!(accept && canSave) || isError"
          @click="$emit('save', synthesis)"
        >
          {{ $t('orders.new.save') }}
        </button>
        <button class="btn btn-accent btn-lg btn-block mt-1" disabled v-if="isLoading">
          {{ $t('processing') }}...
          <CircleLoader />
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';
import CircleLoader from '@/components/ui/CircleLoader';
import CreateOrderPanelSynthesisItem from '@/views/GetSim/CreateOrder/CreateOrderPanelSynthesisItem.vue';
import { getOfferServices } from '@/components/Services/utils.js';
import { formatCurrency } from '@/utils/numbers.js';

export default {
  components: {
    UiCheckbox,
    CircleLoader,
    CreateOrderPanelSynthesisItem,
  },
  props: {
    title: String,
    synthesis: {
      type: Object,
      required: true,
    },
    canSave: Boolean,
    isLoading: Boolean,
    isError: Boolean,
  },
  data() {
    return {
      accept: false,
    };
  },

  methods: {
    formatCurrency(value) {
      return formatCurrency(value);
    },

    getApnServices(services) {
      return services
        .filter((s) => {
          // caution: s.parameters can return null or [null]
          return !!s && !!s.parameters && !!s.parameters.length && !!s.parameters[0];
        })
        .map((p) => {
          const parameters = p.parameters.map((p) => {
            return {
              code: p.code,
              name: p.name,
              version: p.versionIp,
              ipAdress: p.ipAdress,
            };
          });
          return parameters;
        });
    },
  },

  computed: {
    formattedItems() {
      const formatted = [];

      if (this.$loGet(this.synthesis, 'offerStep')) {
        if (this.$loGet(this.synthesis, 'offerStep.name')) {
          const services = getOfferServices(
            this.$loGet(this.synthesis, 'offerStep.initialOffer.marketingService')
          )
            .map((s) => ` ${s.labelService}`)
            .toString();
          const apn = this.getApnServices(
            this.$loGet(this.synthesis, 'offerStep.initialOffer.marketingService')
          )[0]
            .map((s) => ` ${this.$t('digitalOffer.offerPackages.' + s.name)}`)
            .toString();
          formatted.push({
            label: 'digitalOffer.offer',
            value: {
              content: [this.$loGet(this.synthesis, 'offerStep.name'), apn, services],
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

      if (this.$loGet(this.synthesis, 'deliveryStep.company')) {
        formatted.push({
          label: 'digitalOffer.synthesis.company',
          value: {
            content: [`${this.$loGet(this.synthesis, 'deliveryStep.company', '-')}`],
          },
        });
      }

      if (this.$loGet(this.synthesis, 'deliveryStep.name')) {
        const civility = `${this.$loGet(this.synthesis, 'deliveryStep.name.title', '')}`;
        const assembledCivility = `${this.$t('common.' + civility)} ${this.$loGet(
          this.synthesis,
          'deliveryStep.name.firstName',
          ''
        )} ${this.$loGet(this.synthesis, 'deliveryStep.name.lastName', '')}`;
        const assembledCityAddress = `${this.$loGet(
          this.synthesis,
          'deliveryStep.address.zipCode',
          '-'
        )} - ${this.$loGet(this.synthesis, 'deliveryStep.address.city', '-')}`;
        formatted.push({
          label: 'digitalOffer.synthesis.billingAddress',
          value: {
            content: [
              assembledCivility,
              `${this.$loGet(this.synthesis, 'deliveryStep.address.address1', '-')}`,
              assembledCityAddress,
            ],
          },
        });
        formatted.push({
          label: 'digitalOffer.synthesis.contact',
          value: {
            content: [
              `${this.$loGet(this.synthesis, 'deliveryStep.contactInformation.email', '-')}`,
              `${this.$loGet(this.synthesis, 'deliveryStep.contactInformation.phone', '-')}`,
            ],
          },
        });
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
        const price =
          this.$loGet(this.synthesis, 'simStep.selectedSimTypeValue.buyingPriceInEuroCentHT', 0) /
          100;
        formatted.push({
          label: this.$t('digitalOffer.synthesis.price'),
          value: {
            content: price,
          },
        });
      }

      return formatted;
    },

    formattedOfferPackagePrice() {
      const price = this.$loGet(
        this.synthesis,
        'offerStep.offerPackages[0].buyingPriceInEuroCentHT',
        0
      );
      return price / 100;
    },

    simPriceHT() {
      const simPriceHT = this.$loGet(
        this.synthesis,
        'simStep.selectedSimTypeValue.buyingPriceInEuroCentHT',
        0
      );
      return simPriceHT / 100;
    },

    simPriceTTC() {
      const simPriceTTC = this.$loGet(
        this.synthesis,
        'simStep.selectedSimTypeValue.buyingPriceInEuroCentTTC',
        0
      );
      return simPriceTTC / 100;
    },

    priceTTC() {
      const price = this.$loGet(
        this.synthesis,
        'offerStep.offerPackages[0].buyingPriceInEuroCentTTC',
        0
      );
      return price / 100;
    },

    priceHT() {
      const price = this.$loGet(
        this.synthesis,
        'offerStep.offerPackages[0].buyingPriceInEuroCentHT',
        0
      );
      return price / 100;
    },

    total() {
      // total TTC : nb SIM * (prix SIM TTC + prix enveloppe TTC)
      const quantity = this.$loGet(this.synthesis, 'simStep.selectedNumberOfSims', 0);
      if (!quantity) return 0;
      return quantity * (this.priceTTC + this.simPriceTTC);
    },

    totalHT() {
      // total HT : nb SIM * (prix SIM HT + prix enveloppe HT)
      const quantity = this.$loGet(this.synthesis, 'simStep.selectedNumberOfSims', 0);
      if (!quantity) return 0;
      return quantity * (this.priceHT + this.simPriceHT);
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
};
</script>

<style scoped lang="scss">
$fontSize: 0.8rem;
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
    border-top: 1px solid $gray-400;
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
  .wizard-synthesis-wrapper {
    .footer ::v-deep label {
      padding-top: 0;
      font-size: 0.9rem;
    }
  }
}

@media (max-height: 588px) {
  .wizard-synthesis-wrapper {
    .footer ::v-deep label {
      padding-top: 10px;
      font-size: 0.9rem;
    }
  }
}
</style>
