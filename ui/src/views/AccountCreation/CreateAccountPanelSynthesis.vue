<template>
  <div class="new-digital-offer-synthesis" :class="{ open: showSynthesis }">
    <h6 class="title title--responsiveNone">
      {{ $t('digitalOffer.synthesis.title') }}
    </h6>
    <h6 class="title title--responsive" @click="canShowSynthesis()">
      {{
        showSynthesis
          ? $t('digitalOffer.synthesis.titleHide')
          : $t('digitalOffer.synthesis.titleShow')
      }}
      <span></span>
    </h6>
    <div class="creationSuccess" v-if="isLoading">
      {{ $t('digitalOffer.synthesis.onGoingCreation') }}
    </div>
    <div class="synthesis-content">
      <CreateAccountPanelSynthesisItem
        :key="item.label"
        v-for="item in formattedItems"
        :item="item"
      />
      <template v-if="displayTotal">
        <div class="synthesis-item table-price d-flex flex-row">
          <div style="flex-basis: 33%">
            <h6 class="subtitle">{{ $t('digitalOffer.synthesis.designation') }}</h6>
            <p>{{ $loGet(formattedPrice[0], 'value.content', '-') }} SIM</p>
          </div>
          <div v-if="$loGet(formattedPrice[1], 'label')" style="flex-basis: 33%">
            <h6 class="subtitle text-right">
              {{ $loGet(formattedPrice[1], 'label') }}
            </h6>
            <p class="text-right">
              {{ formatCurrency($loGet(formattedPrice[1], 'value.content')) }} €
            </p>
          </div>
          <div style="flex-basis: 33%">
            <h6 class="subtitle text-right">
              {{ $t('bills.amount') }}
            </h6>
            <p class="text-right">
              {{
                formatCurrency(
                  $loGet(formattedPrice[1], 'value.content') *
                    $loGet(formattedPrice[0], 'value.content', '-')
                )
              }}
              €
            </p>
          </div>
        </div>
        <div class="synthesis-item table-price d-flex flex-row">
          <div style="flex-basis: 33%" v-if="$loGet(formattedPrice[0], 'label')">
            <p>
              {{ $loGet(formattedPrice[0], 'value.content', '-') }}
              {{ $t('digitalOffer.synthesis.topup') }}
            </p>
          </div>
          <div v-if="$loGet(formattedPrice[1], 'label')" style="flex-basis: 33%">
            <p class="text-right">{{ formatCurrency(formattedOfferPackagePrice) }} €</p>
          </div>
          <div style="flex-basis: 33%">
            <p class="text-right">
              {{
                formatCurrency(
                  formattedOfferPackagePrice * $loGet(formattedPrice[0], 'value.content', '-')
                )
              }}
              €
            </p>
          </div>
        </div>
      </template>
      <hr class="separator" />
      <div v-if="displayTotal">
        <div class="total bold">
          <span class="flex-grow-1">{{ formattedSubTotalHT }}</span>
          <span>{{ formatCurrency(totalHT) }} €</span>
        </div>
        <div class="total">
          <span class="flex-grow-1">{{ $t('shippingCost') }}</span>
          <span>{{ formatCurrency(10) }} €</span>
        </div>
        <div class="total">
          <span class="flex-grow-1">{{ $t('shippingOfferedCost') }}</span>
          <span>- {{ formatCurrency(10) }} €</span>
        </div>
        <div class="total" v-if="displayDiscount">
          <span class="flex-grow-1">{{ $t('digitalOffer.discount') }}</span>
          <span>- {{ formatCurrency(formattedDiscountHT) }} €</span>
        </div>
        <div class="total bold">
          <span class="flex-grow-1">{{ formattedTotalHT }}</span>
          <span>{{ formatCurrency(totalDiscountHT) }} €</span>
        </div>
        <div class="total">
          <span class="flex-grow-1">{{ formattedTotalTVA }}</span>
          <span>{{ formatCurrency(totalTVA) }} €</span>
        </div>
        <div class="total bold">
          <span class="flex-grow-1">{{ formattedTotalTTC }}</span>
          <span>{{ formatCurrency(total) }} €</span>
        </div>
      </div>
    </div>
    <div class="footer pt-3" :class="{ displayResponsive: canSave }">
      <template v-if="isError">
        <slot name="errors"></slot>
      </template>
      <template v-if="canSave && !isSuccess">
        <UiCheckbox v-model="accept" :disabled="!canSave" v-if="!isLoading">
          <span v-if="!conditionUrl">{{ $t('orders.new.acceptConditions') }}</span>
          <span v-if="conditionUrl"
            >{{ $t('orders.new.accept') }}
            <a :href="conditionUrl">{{ $t('orders.new.conditions') }}</a>
          </span>
        </UiCheckbox>
        <button
          v-if="!isLoading"
          type="button"
          class="btn btn-accent btn-lg btn-block mt-1"
          :disabled="!(accept && canSave) || isError"
          @click="$emit('save')"
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
import CreateAccountPanelSynthesisItem from '@/views/GetSim/CreateOrder/CreateOrderPanelSynthesisItem.vue';
import CircleLoader from '@/components/ui/CircleLoader';
import { formatCurrency } from '@/utils/numbers.js';
import { getActiveServicesWithoutAPN } from '@/components/Services/utils.js';
import { getOrderConditionUrl } from '@/api/digital';
import UiCheckbox from '@/components/ui/Checkbox';

export default {
  async mounted() {
    this.conditionUrl = await getOrderConditionUrl();
  },
  components: {
    CreateAccountPanelSynthesisItem,
    CircleLoader,
    UiCheckbox,
  },
  props: {
    synthesis: {
      type: Object,
      required: true,
    },
    canSave: Boolean,
    isLoading: Boolean,
    isError: Boolean,
    isSuccess: Boolean,
  },
  data() {
    return {
      accept: false,
      conditionUrl: '',
      showSynthesis: false,
    };
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
            )} - ${this.$loGet(this.synthesis, 'creationAccountStep.city', '-')} `;
            formatted.push({
              label: 'digitalOffer.synthesis.billingAddress',
              value: {
                content: [
                  assembledCivility,
                  `${this.$loGet(this.synthesis, 'creationAccountStep.address', '-')}`,
                  assembledCityAddress,
                  `${this.$loGet(this.synthesis, 'creationAccountStep.country.label', '-')}`,
                ],
              },
            });
            formatted.push({
              label: 'digitalOffer.synthesis.contact',
              value: {
                content: [
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
          const services = getActiveServicesWithoutAPN(
            this.$loGet(this.synthesis, 'offerStep.initialOffer.marketingService')
          )
            .map((s) => ` ${s.labelService}`)
            .toString();
          const apn = this.getApnServices(
            this.$loGet(this.synthesis, 'offerStep.initialOffer.marketingService')
          )
            ? this.getApnServices(
                this.$loGet(this.synthesis, 'offerStep.initialOffer.marketingService')
              )[0]
                .map((s) => ` ${this.$t('digitalOffer.offerPackages.' + s.name)}`)
                .toString()
            : [];
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
      return this.totalDiscountHT + this.totalTVA;
    },

    totalHT() {
      // total HT : nb SIM * (prix SIM HT + prix enveloppe HT)
      const quantity = this.$loGet(this.synthesis, 'simStep.selectedNumberOfSims', 0);
      if (!quantity) return 0;
      return quantity * (this.priceHT + this.simPriceHT);
    },

    totalTVA() {
      const quantity = this.$loGet(this.synthesis, 'simStep.selectedNumberOfSims', 0);
      if (!quantity) return 0;
      if (!this.totalDiscountHT) return 0;
      const total = quantity * (this.priceTTC + this.simPriceTTC) - this.formattedDiscountTTC;
      return total - this.totalDiscountHT;
    },

    formattedTotalTTC() {
      return `${this.$t('total').toUpperCase()} TTC`;
    },

    formattedSubTotalHT() {
      return `${this.$t('digitalOffer.subTotal').toUpperCase()} HT`;
    },

    formattedTotalHT() {
      return `${this.$t('total').toUpperCase()} HT`;
    },
    formattedDiscountHT() {
      return this.formattedDiscount(this.simPriceHT, this.priceHT);
    },
    formattedDiscountTTC() {
      return this.formattedDiscount(this.simPriceTTC, this.priceTTC);
    },
    displayDiscount() {
      return (
        this.synthesis &&
        this.synthesis.simStep &&
        this.synthesis.simStep.discounts &&
        this.synthesis.simStep.selectedNumberOfSims <= this.synthesis.simStep.discounts.remainingSim
      );
    },

    totalDiscountHT() {
      if (!this.synthesis) return 0;
      if (this.displayDiscount) {
        return this.totalHT - this.formattedDiscountHT;
      } else {
        return this.totalHT;
      }
    },

    formattedTotalTVA() {
      return `${this.$t('bills.amount')} TVA`;
    },

    displayTotal() {
      return this.formattedPrice[0] && this.formattedPrice[0].label === this.$t('common.quantity');
    },
  },

  methods: {
    canShowSynthesis() {
      this.showSynthesis = !this.showSynthesis;
    },

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
    formattedDiscount(simPrice, topUpPrice) {
      let totalSimDiscount = 0;
      const quantitySimDiscount = this.$loGet(this.synthesis, 'simStep.selectedNumberOfSims', 0);
      if (this.$loGet(this.synthesis, 'simStep')) {
        if (this.$loGet(this.synthesis, 'simStep.discounts')) {
          if (this.$loGet(this.synthesis, 'simStep.discounts.simDiscount')) {
            totalSimDiscount = this.$loGet(this.synthesis, 'simStep.discounts.simDiscount');
          }
        }
      }

      let totalTopUpDiscount = 0;
      const quantityTopUpDiscount = this.$loGet(this.synthesis, 'simStep.selectedNumberOfSims', 0);
      if (this.$loGet(this.synthesis, 'simStep')) {
        if (this.$loGet(this.synthesis, 'simStep.discounts')) {
          if (this.$loGet(this.synthesis, 'simStep.discounts.topUpDiscount')) {
            totalTopUpDiscount = this.$loGet(this.synthesis, 'simStep.discounts.topUpDiscount');
          }
        }
      }

      const totalSim = quantitySimDiscount * (simPrice * (totalSimDiscount / 100));
      const totalTopUp = quantityTopUpDiscount * (topUpPrice * (totalTopUpDiscount / 100));
      return totalSim + totalTopUp;
    },
  },
};
</script>

<style scoped lang="scss">
$fontSize: 0.8rem;
.bold {
  font-weight: bold;
}
.new-digital-offer-synthesis {
  padding: 1em !important;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 25%;
  transition: 0.2s;
  background: #f3f3f3;
  @media screen and (max-width: 900px) {
    height: 60px;
    width: 100%;
  }

  .synthesis-content {
    overflow-y: auto;
    flex-grow: 1;
  }
  h6 {
    span {
      width: 15px;
      height: 15px;
      border-right: 2px solid grey;
      border-top: 2px solid grey;
      border-left: 2px solid transparent;
      border-bottom: 2px solid transparent;
      transform: rotate(135deg);
      position: absolute;
      right: 30px;
      top: 15px;
      transition: 0.2s;
    }

    &.title {
      margin-bottom: 2em;

      &--responsive {
        display: none;
        @media screen and (max-width: 900px) {
          display: block;
        }
      }
      &--responsiveNone {
        @media screen and (max-width: 900px) {
          display: none;
        }
      }
      @media screen and (max-width: 900px) {
        font-size: 14px;
        margin-top: 1rem;
      }
    }
    &.subtitle {
      color: $gray-680;
      font-size: $fontSize;
      font-weight: 500;
    }
  }

  &.open {
    @media screen and (max-width: 900px) {
      height: 100vh;

      h6 span {
        transform: rotate(-45deg);
      }
    }
  }

  .footer {
    button {
      font-size: 1rem;
    }
    @media screen and (max-width: 900px) {
      position: fixed;
      bottom: 0;
      right: 10px;
      display: none;
      align-items: center;
      width: 80%;
      justify-content: flex-end;
      height: 70px;
      z-index: 99;
      &.displayResponsive {
        display: flex;
      }
      .checkbox-container {
        margin-right: 10px;
        margin-top: 7px;
        & ::v-deep label.filled {
          margin-bottom: 0;
        }
        & ::v-deep span.checkmark {
          margin-top: 7px;
        }
      }
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
