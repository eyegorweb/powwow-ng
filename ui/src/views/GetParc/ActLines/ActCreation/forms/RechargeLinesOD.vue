<template>
  <VerticalEmptyContainer
    :validate-fn="validate"
    :confirm-msg="confirmationMessage"
    no-confirm-translation
  >
    <div slot="main">
      <div class="pricing">
        <div v-if="hasDiscounts && !limitDiscounts" class="pricing-container">
          <div class="alert alert-success pricing-container">
            {{
              $t('digitalOffer.topUp.displayDiscount', {
                nbRemainingSim: topUpdiscount.remainingSim,
              })
            }}
          </div>
        </div>
        <div v-if="limitDiscounts" class="pricing-container">
          <div class="alert alert-warning">
            {{
              $t('digitalOffer.topUp.warningDiscount', {
                nbRemainingSim: topUpdiscount.remainingSim,
              })
            }}
          </div>
        </div>
        <div v-if="packages" class="pricing-container">
          <div class="card" v-for="(offer, index) in packages" :key="index">
            <OfferCard
              :offer="offer"
              :recharge="true"
              :is-active="offer === currentOffer"
              @select:offer="getCurrentOffer"
            />
          </div>
        </div>
      </div>
    </div>
    <div slot="bottom" slot-scope="{ containerValidationFn }">
      <template v-if="displayTotal">
        <div class="pricing">
          <div class="synthesis-content mb-3">
            <div class="d-flex flex-row">
              <div style="flex-basis: 33%">
                <h6 class="subtitle">{{ $t('digitalOffer.synthesis.designation') }}</h6>
                <p>{{ totalSelected }} {{ $t('digitalOffer.synthesis.topup') }}</p>
              </div>
              <div v-if="$loGet(formattedPrice[0], 'label')" style="flex-basis: 33%">
                <h6 class="subtitle text-right">
                  {{ $t('digitalOffer.synthesis.price') }}
                </h6>
                <p class="text-right">
                  {{ formatCurrency($loGet(formattedPrice[0], 'value.content')) }} €
                </p>
              </div>
              <div style="flex-basis: 33%">
                <h6 class="subtitle text-right">
                  {{ $t('bills.amount') }}
                </h6>
                <p class="text-right">
                  {{
                    formatCurrency(totalSelected * $loGet(formattedPrice[0], 'value.content', '-'))
                  }}
                  €
                </p>
              </div>
            </div>
            <hr class="separator" />
            <div class="total bold d-flex flex-row">
              <span class="flex-grow-1">{{ formattedSubTotalHT }}</span>
              <span>{{ formatCurrency(subTotalHT) }} €</span>
            </div>
            <div class="total d-flex flex-row" v-if="displayDiscount">
              <span class="flex-grow-1">{{ $t('digitalOffer.discount') }}</span>
              <span>- {{ formatCurrency(formattedDiscountHT) }} €</span>
            </div>
            <div class="total bold d-flex flex-row">
              <span class="flex-grow-1">{{ formattedTotalHT }}</span>
              <span>{{ formatCurrency(totalHT) }} €</span>
            </div>
            <div class="total d-flex flex-row">
              <span class="flex-grow-1">{{ formattedTotalTVA }}</span>
              <span>{{ formatCurrency(totalTVA) }} €</span>
            </div>
            <div class="total bold d-flex flex-row">
              <span class="flex-grow-1">{{ formattedTotalTTC }}</span>
              <span>{{ formatCurrency(total) }} €</span>
            </div>
          </div>
        </div>
      </template>

      <div class="row">
        <div class="col-md-4">
          <UiDate
            @change="onActDateChange"
            :value="actDate"
            :error="dateError"
            class="d-block"
            :min-date="minDate"
            time-picker
            fixed
          >
            <em slot="icon" class="select-icon ic-Flag-Icon" />
          </UiDate>
        </div>
        <div class="col-md-4">
          <Button
            @click="containerValidationFn"
            variant="primary"
            :disabled="!currentOffer || isLoading"
            >{{ $t('getparc.actCreation.carouselItem.RECHARGE_LINES_BTN') }}
          </Button>
          <CircleLoader class="load" v-if="isLoading" />
        </div>
      </div>
    </div>
    <div slot="messages" class="text-info">
      <div v-if="exceptionError">
        <h6 class="text-danger">{{ $t('errors.all') }}</h6>
        <div class="text-danger">
          {{ exceptionError }}
        </div>
      </div>
    </div>
  </VerticalEmptyContainer>
</template>

<script>
import VerticalEmptyContainer from './parts/VerticalEmptyContainer';
import OfferCard from '@/views/AccountCreation/OfferCard.vue';
import UiDate from '@/components/ui/UiDate';
import Button from '@/components/ui/Button';
import CircleLoader from '@/components/ui/CircleLoader';
import moment from 'moment';
import { fetchODOffers, rechargeLineOD } from '@/api/offers.js';
import { mapState, mapGetters } from 'vuex';
import { formattedCurrentDateExtended } from '@/utils/date.js';
import { formatBackErrors } from '@/utils/errors';
import { formatCurrency } from '@/utils/numbers.js';

export default {
  components: {
    VerticalEmptyContainer,
    UiDate,
    OfferCard,
    Button,
    CircleLoader,
  },
  data() {
    return {
      packages: undefined,
      discounts: undefined,
      exceptionError: undefined,
      actDate: null,
      dateError: null,
      currentOffer: undefined,
      workflowId: undefined,
      isLoading: false,
    };
  },
  props: {
    totalSelected: Number,
  },
  computed: {
    ...mapState('actLines', [
      'linesActionsResponse',
      'selectedLinesForActCreation',
      'actCreationPrerequisites',
    ]),
    ...mapGetters('actLines', ['appliedFilters']),
    minDate() {
      return moment().format('DD/MM/YYYY HH:mm:ss');
    },
    confirmationMessage() {
      if (this.currentOffer) {
        return `${this.$t('getparc.actCreation.rechargeOD.confirm')} "${
          this.currentOffer.label
        }" ?`;
      }

      return '';
    },
    hasDiscounts() {
      return (
        this.discounts && this.discounts.length && !!this.discounts.find((d) => d.step === 'TOP_UP')
      );
    },
    limitDiscounts() {
      if (this.hasDiscounts) {
        return !!(this.totalSelected > this.topUpdiscount.remainingSim);
      }
      return undefined;
    },
    topUpdiscount() {
      if (this.hasDiscounts) {
        return this.discounts.find((d) => d.step === 'TOP_UP');
      }
      return undefined;
    },
    displayTotal() {
      return (
        this.formattedPrice[0] &&
        this.formattedPrice[0].label === this.$t('digitalOffer.synthesis.price')
      );
    },
    formattedPrice() {
      const formatted = [];

      if (this.$loGet(this.currentOffer, 'buyingPriceInEuroCentHT')) {
        const price = this.$loGet(this.currentOffer, 'buyingPriceInEuroCentHT', 0) / 100;
        formatted.push({
          label: this.$t('digitalOffer.synthesis.price'),
          value: {
            content: price,
          },
        });
      }

      return formatted;
    },
    subTotalHT() {
      return this.$loGet(this.formattedPrice[0], 'value.content') * this.totalSelected;
    },
    totalHT() {
      return this.subTotalHT - this.formattedDiscountHT;
    },
    totalTVA() {
      let total = 0;
      let totalTTC = this.priceTTC * this.totalSelected;
      if (!this.totalDiscountHT) return 0;
      if (this.displayDiscount) {
        total = totalTTC - this.formattedDiscountTTC;
        return total - this.totalDiscountHT;
      } else {
        return totalTTC - this.totalHT;
      }
    },
    total() {
      return this.totalDiscountHT + this.totalTVA;
    },
    formattedSubTotalHT() {
      return `${this.$t('digitalOffer.subTotal').toUpperCase()} HT`;
    },
    formattedTotalHT() {
      return `${this.$t('total').toUpperCase()} HT`;
    },
    formattedTotalTVA() {
      return `${this.$t('bills.amount')} TVA`;
    },
    formattedTotalTTC() {
      return `${this.$t('total').toUpperCase()} TTC`;
    },
    displayDiscount() {
      return (
        !!this.topUpdiscount &&
        this.topUpdiscount.remainingSim &&
        this.topUpdiscount.remainingSim >= this.totalSelected
      );
    },
    formattedDiscountHT() {
      return this.formattedDiscount(this.priceHT);
    },
    formattedDiscountTTC() {
      return this.formattedDiscount(this.priceTTC);
    },
    priceHT() {
      const price = this.$loGet(this.currentOffer, 'buyingPriceInEuroCentHT', 0);
      return price / 100;
    },
    priceTTC() {
      const price = this.$loGet(this.currentOffer, 'buyingPriceInEuroCentTTC', 0);
      return price / 100;
    },
    totalDiscountHT() {
      if (!this.topUpdiscount) return 0;
      return this.totalHT;
    },
  },
  async mounted() {
    let response = undefined;
    const workflowDescription =
      this.linesActionsResponse && this.linesActionsResponse.items
        ? this.$loGet(this.linesActionsResponse.items[0], 'workflow.workflowDescription', '')
        : '';
    if (this.actCreationPrerequisites && this.actCreationPrerequisites.partner) {
      response = await fetchODOffers(
        this.actCreationPrerequisites.partner.id,
        this.actCreationPrerequisites.offer.label
      );
    } else if (workflowDescription) {
      response = await fetchODOffers('', workflowDescription);
    }
    if (response.items && response.items.length) {
      this.packages = this.$loGet(response.items[0], 'offerPackages', []);
      this.discounts = this.$loGet(response.items[0], 'discounts', []);
      this.packages.forEach((aPackage) => {
        aPackage.name = this.$loGet(response.items[0], 'name');
        aPackage.workflowDescription = this.$loGet(response.items[0], 'workflowDescription');
      });
      this.workflowId = this.$loGet(response.items[0], 'id', []);
    }
    this.actDate = formattedCurrentDateExtended();
  },
  methods: {
    getCurrentOffer(offer) {
      this.currentOffer = offer.selectedOffer;
    },
    onActDateChange(value) {
      this.actDate = value;
    },
    formatCurrency(value) {
      return formatCurrency(value);
    },
    formattedDiscount(topUpPrice) {
      const topUpValue =
        this.topUpdiscount && this.topUpdiscount.topUpDiscount
          ? this.topUpdiscount.topUpDiscount
          : 0;
      const totalTopUp = this.totalSelected * (topUpPrice * (topUpValue / 100));
      return totalTopUp;
    },
    async validate() {
      this.isLoading = true;
      const envelopeLabel = this.currentOffer.label;
      const simCardIds = this.selectedLinesForActCreation.map((i) => i.id);
      const response = await rechargeLineOD(
        this.actCreationPrerequisites.partner.id,
        this.appliedFilters,
        this.actDate,
        this.workflowId,
        envelopeLabel,
        simCardIds,
        'DIGITAL_OFFER'
      );
      this.isLoading = false;

      if (response.errors && response.errors.length) {
        let errorMessage = '',
          massActionLimitError = '',
          count;
        const formatted = formatBackErrors(response.errors)
          .map((e) => e.errors)
          .flat();
        formatted.forEach((e) => {
          if (e.key === 'limit') {
            count = e.value;
          }
          if (e.key === 'error') {
            massActionLimitError = `${e.key}.${e.value}`;
          } else {
            errorMessage = `${e.key}: ${e.value}`;
          }
        });
        if (massActionLimitError) {
          this.exceptionError = `${this.$t(
            'getparc.actCreation.report.errors.' + massActionLimitError,
            {
              count,
            }
          )}`;
        } else {
          this.exceptionError = errorMessage;
        }
        return {
          errors: response.errors,
          validationError: {
            validated: response.validated,
            tempDataUuid: response.tempDataUuid,
          },
        };
      } else {
        window.location.href = response.url;
      }
      return response;
    },
  },
};
</script>

<style lang="scss" scoped>
$main-font-color: #808080;
$main-font-weight: 300;
$primary-color: #57e2b2;
$fontSize: 0.8rem;
.bold {
  font-weight: bold;
}

.pricing {
  .pricing-container {
    display: flex;
    flex-wrap: wrap;
    font-size: $fontSize;
  }
  .entry {
    flex-basis: 24.3333333%;

    ul {
      min-height: 6rem;
    }
  }
  .card {
    border: none;
    margin-right: 10px;
  }

  // Buttons
  .btn {
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: $main-font-weight + 200;
    color: lighten($main-font-color, 15%);
    border-radius: 0;
    padding: 0.75rem 1.25rem;
    letter-spacing: 1px;
  }

  .btn-gradient {
    background-color: #f2f2f2;
    transition: background 0.3s ease-in-out;

    &:hover {
      color: white;
      background-color: $primary;
    }
  }
  .synthesis-content {
    overflow-y: auto;
    flex-grow: 1;
    max-width: 90%;

    .separator {
      border: 1px solid #000;
    }
  }
}
.load {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-left: 5px;
}
</style>
