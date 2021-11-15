<template>
  <div class="pricing-table" :class="isActive ? 'active' : ''">
    <div class="package-title">
      <span>{{ offer.name }}</span>
    </div>
    <div class="package-layout">
      <div class="package-value">
        <div class="value">{{ offer.initialOffer.buyingPriceInEuroCentTTC }}</div>
        <div class="period">€</div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="terms">
      <div class="term">
        {{
          $t('digitalOffer.offerPackages.DATA', {
            value: offer.initialOffer.offerPackages.filter((o) => o.usageType == 'DATA')[0]
              .envelopeValue,
            unit: offer.initialOffer.offerPackages.filter((o) => o.usageType == 'DATA')[0].unit,
          })
        }},
        {{
          $t('digitalOffer.offerPackages.SMS', {
            value: offer.initialOffer.offerPackages.filter((o) => o.usageType == 'SMS')[0]
              .envelopeValue,
          })
        }},
        {{
          $t('digitalOffer.offerPackages.VOICE', {
            value: offer.initialOffer.offerPackages.filter((o) => o.usageType == 'VOICE')[0]
              .envelopeValue,
            unit: offer.initialOffer.offerPackages.filter((o) => o.usageType == 'VOICE')[0].unit,
          })
        }}
      </div>
      <div
        v-for="service in offer.initialOffer.marketingService.filter(
          (s) => s.code == 'ROAMING' || s.code == '4G'
        )"
        :key="service.id"
      >
        <div class="term">{{ service.labelService }}</div>
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
    };
  },
  props: {
    offer: Object,
    isActive: Boolean,
  },
  methods: {
    onClick() {
      this.$emit('select:offer', { selectedOffer: this.offer });
      this.selectedOffer = this.offer;
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

  will-change: box-shadow;
  transition: box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1),
    background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
  &:hover,
  &:focus,
  &.active {
    box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12),
      0 5px 5px -3px rgba(0, 0, 0, 0.4);
  }
  .package-title {
    display: flex;
    justify-content: space-between;
    padding: 16px 24px;
    background-color: $title-bg-color;
    font-size: 1.125rem;
    color: #fff;
    text-transform: uppercase;

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
      align-items: flex-end;

      .value {
        font-size: 4.5rem;
        font-weight: 300;
        line-height: 1;
      }

      .period {
        padding: 0 0 5px 4px;
        font-size: 1.125rem;
        font-weight: 300;
        color: $muted;
      }
    }
  }

  .terms {
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
    font-size: 0.9125rem;
    text-align: center;

    .term {
      span {
        font-weight: 500;
      }
    }
  }

  .subscribe-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem auto 2rem;
    padding: 2px 18px;
    min-width: 128px;
    border: none;
    border-radius: 3px;
    background-color: $blue;
    font-family: $font-family;
    font-size: 0.875rem;
    font-weight: 500;
    color: #fff;
    line-height: 39px;
    text-transform: uppercase;
    overflow: hidden;
    will-change: box-shadow;
    transition: box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1),
      background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    vertical-align: middle;
    -webkit-tap-highlight-color: transparent;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
      0 3px 1px -2px rgba(0, 0, 0, 0.2);
    &:hover,
    &:focus {
      box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12),
        0 5px 5px -3px rgba(0, 0, 0, 0.4);
    }
  }

  .divider {
    display: block;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    margin: 8px 32px;
  }
}
</style>