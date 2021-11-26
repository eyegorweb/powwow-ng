<template>
  <div class="pricing-table" :class="isActive ? 'active' : ''">
    <div class="package-title" :class="isActive ? 'active' : ''">
      <span>{{ offer.name }}</span>
    </div>
    <div class="package-layout">
      <div class="package-value">
        <div class="euro-value">
          {{ offerPrice('EURO_PART') }}
        </div>
        <div class="cent-with-period">
          <div class="cent-value">€{{ offerPrice('CENT_PART') }}</div>
          <div class="period">
            {{
              $t('digitalOffer.offerStep.offerPeriod', {
                period,
              })
            }}
          </div>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="terms">
      <div class="term details">
        <template v-if="dataUsage"> {{ dataUsage }}, </template>
        <template v-if="smsUsage"> {{ smsUsage }}, </template>
        <template v-if="voiceUsage"> {{ voiceUsage }}</template>
      </div>
      <div v-for="(service, index) in offer.initialOffer.marketingService" :key="service.id">
        <div class="term" v-if="index < maxServicesShow">{{ service.labelService }}</div>
      </div>
    </div>
    <button class="subscribe-btn" @click="onClick()">
      <span> {{ $t('digitalOffer.offerStep.subscribe') }}</span>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedOffer: undefined,
      price: undefined,
      maxServices: 3,
    };
  },
  props: {
    offer: Object,
    isActive: Boolean,
  },
  mounted() {
    this.price =
      this.offer && this.offer.offerPackage[0] && this.offer.offerPackage[0].buyingPriceInEuroCentHT
        ? this.offer.offerPackage[0].buyingPriceInEuroCentHT
        : 0;
  },
  methods: {
    onClick() {
      this.$emit('select:offer', { selectedOffer: this.offer });
      this.selectedOffer = this.offer;
    },
    offerPrice(part) {
      var floatPrice = this.price / 100;
      floatPrice = floatPrice.toFixed(2);
      let splittedPrice = (floatPrice + '').split('.');
      switch (part) {
        case 'EURO_PART':
          return splittedPrice[0];
        case 'CENT_PART':
          if (splittedPrice[1] === '00') {
            return '';
          }
          return splittedPrice[1];
        default:
          console.log(`Sorry, we are out of ${part}.`);
          return '';
      }
    },
  },
  computed: {
    period() {
      return this.offer &&
        this.offer.offerPackage[0] &&
        this.offer.offerPackage[0].usage[0] &&
        this.offer.offerPackage[0].usage[0].duration
        ? this.offer.offerPackage[0].usage[0].duration
        : 0;
    },
    maxServicesShow() {
      return this.maxServices === 3 && this.isActive ? 99 : 3;
    },
    dataUsage() {
      const value =
        this.offer && this.offer.offerPackage[0] && this.offer.offerPackage[0].usage
          ? this.offer.offerPackage[0].usage.filter((o) => o.usageType === 'DATA')[0].envelopeValue
          : 0;
      if (value) {
        return this.$t('digitalOffer.offerPackages.DATA', {
          value,
          unit: this.offer.offerPackage[0].usage.filter((o) => o.usageType === 'DATA')[0].unit,
        });
      }
      return 0;
    },
    smsUsage() {
      const value =
        this.offer && this.offer.offerPackage[0] && this.offer.offerPackage[0].usage
          ? this.offer.offerPackage[0].usage.filter((o) => o.usageType === 'SMS')[0].envelopeValue
          : 0;
      if (value) {
        return this.$t('digitalOffer.offerPackages.SMS', {
          value,
          unit: this.offer.offerPackage[0].usage.filter((o) => o.usageType === 'SMS')[0].unit,
        });
      }
      return 0;
    },
    voiceUsage() {
      const value =
        this.offer && this.offer.offerPackage[0] && this.offer.offerPackage[0].usage
          ? this.offer.offerPackage[0].usage.filter((o) => o.usageType === 'VOICE')[0].envelopeValue
          : 0;
      if (value) {
        return this.$t('digitalOffer.offerPackages.VOICE', {
          value,
          unit: this.offer.offerPackage[0].usage.filter((o) => o.usageType === 'VOICE')[0].unit,
        });
      }
      return 0;
    },
  },
};
</script>

<style lang="scss" scoped>
$font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;

$black: rgba(0, 0, 0, 0.87);
$blue: #2196f3;
$dark-gray: #263238;
$gray: #eee;
$muted: rgba(0, 0, 0, 0.54);

$body-bg: $gray;
$text-color: $black;
$text-currency: $muted;
$title-bg-color: $dark-gray;

$box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
  0 2px 1px -1px rgba(0, 0, 0, 0.12);

// Pricing tables
.pricing-table {
  display: flex;
  flex-direction: column;
  margin: 0 0 32px;
  background-color: #fff;
  border-radius: 3px;
  overflow: hidden;
  border: 3px solid $title-bg-color;
  &:hover,
  &:focus,
  &.active {
    border: 3px solid $blue;

    .package-title {
      background-color: $blue;
    }
  }
  .package-title {
    display: flex;
    justify-content: center;
    padding: 16px 24px;
    background-color: $title-bg-color;
    font-size: 1.125rem;
    color: #fff;
    text-transform: uppercase;

    &.active {
      background-color: $blue;
    }

    .sale {
      padding: 0 0.5rem;
      border-radius: 3px;
      background-color: #fff;
      font-size: 0.8125rem;
      font-weight: 500;
      color: $dark-gray;
      line-height: 1.7;
    }
  }

  .package-layout {
    display: flex;
    justify-content: center;
    padding: 2rem 2rem 1rem;

    .package-currency {
      padding-right: 4px;
      font-size: 1.5rem;
      font-weight: 500;
      color: $text-currency;
    }

    .package-value {
      display: flex;
      align-items: center;

      .euro-value {
        font-size: 4.5rem;
        font-weight: 600;
        line-height: 1;
      }

      .period {
        padding: 0 0 5px 4px;
        font-size: 0.8rem;
        font-weight: 400;
        color: $muted;
      }
      .cent-value {
        font-size: 1.5rem;
      }
    }
  }

  .terms {
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
    font-size: 0.9125rem;
    text-align: center;

    .details {
      font-weight: 600;
    }

    .term {
      span {
        font-weight: 600;
      }
    }
  }

  .seeMore {
    font-weight: bold;
    cursor: pointer;
  }

  .subscribe-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem auto 2rem;
    padding: 2px 18px;
    min-width: 128px;
    border: none;
    border-radius: 30px;
    font-family: $font-family;
    font-size: 0.875rem;
    line-height: 30px;
    text-transform: uppercase;
    overflow: hidden;
    outline: none;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    vertical-align: middle;
    background: white;
    font-weight: 600;
    color: black;
    border: 2px solid $blue;
    &:hover,
    &:focus {
      background-color: $blue;
      border: 2px solid $blue;
      color: #fff;
    }
  }

  .divider {
    display: block;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    margin: 8px 32px;
  }
}
</style>
