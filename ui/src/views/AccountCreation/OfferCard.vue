<template>
  <div class="pricing-table" :class="[{ active: isActive }, { minCard: recharge }]" v-if="offerUse">
    <div class="logo" v-if="recharge && displayedOffer">
      <a>
        <img :src="require(`@/assets/${displayedOffer.img}.png`)" />
      </a>
    </div>
    <!-- <div class="package-title" v-if="offer && offer.name" :class="isActive ? 'active' : ''">
      <span>{{ offer.workflowDescription || '-' }}</span>
    </div> -->
    <div class="title" v-else-if="offer && offer.name" :class="isActive ? 'active' : ''">
      <span>{{ offer.workflowDescription || '-' }}</span>
    </div>
    <hr class="divider" />
    <div class="package-layout">
      <div class="package-value">
        <div class="euro-value">{{ offerPrice('EURO_PART') }}</div>
        <div class="centWithPeriod">
          <div class="cent-value">€{{ offerPrice('CENT_PART') }}</div>
          <div class="period">
            {{
              $t('digitalOffer.offerStep.offerPeriod', {
                period: offerUse.validityDuration,
              })
            }}
          </div>
        </div>
      </div>
    </div>
    <a class="readMore" v-if="readMore" :href="displayedOffer.link" target="_blank">{{
      $t('readMore')
    }}</a>
    <hr class="divider" />
    <div class="terms" :class="recharge ? 'minCard' : ''">
      <div v-if="displayedOffer" class="term">
        <div v-if="!recharge" class="logo_order">
          <a>
            <img :src="require(`@/assets/${displayedOffer.img}.png`)" />
          </a>
        </div>
        <div v-for="service in displayedOffer.services" :key="service.id">
          <div>
            {{ service }}
          </div>
        </div>
      </div>
      <div v-else>
        <div class="term details">
          <template v-if="allUsage('DATA')">{{ allUsage('DATA') }}</template>
          <template v-if="allUsage('SMS')">, {{ allUsage('SMS') }}</template>
          <template v-if="allUsage('VOICE')">, {{ allUsage('VOICE') }}</template>
        </div>
        <div v-if="offer.initialOffer && !displayedOffer">
          <div v-for="(service, index) in activeServices" :key="service.id">
            <div class="term" v-if="index < maxServicesShow && !service.parameters">
              {{ service.labelService }}
            </div>
            <div
              class="term"
              v-if="
                index < maxServicesShow &&
                  service &&
                  service.parameters &&
                  service.parameters.length &&
                  service.parameters[0].name
              "
            >
              {{ $t('digitalOffer.offerPackages.' + service.parameters[0].name) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-if="recharge">
      <button class="subscribe-btn" @click="onClick()">
        <span> {{ $t('select') }}</span>
      </button>
    </template>
    <template v-else>
      <button class="subscribe-btn" @click="onClick()">
        {{ $t('digitalOffer.offerStep.subscribe') }}
      </button>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedOffer: undefined,
      price: undefined,
      maxServices: 3,
      offerUse: undefined,
      activeServices: undefined,
    };
  },
  props: {
    offer: Object,
    displayedOffer: Object,
    isActive: Boolean,
    recharge: Boolean,
    readMore: Boolean,
  },
  mounted() {
    this.offerUse = this.offer.offerPackages ? this.offer.offerPackages[0] : this.offer;
    this.price = this.$loGet(this.offerUse, 'buyingPriceInEuroCentHT', 0);
    const marketingService = this.$loGet(this.offer, 'initialOffer.marketingService');
    if (marketingService) {
      this.activeServices = marketingService.filter((s) => s.activated);
    }
  },
  methods: {
    onClick() {
      this.$emit('select:offer', { selectedOffer: this.offer });
      this.selectedOffer = this.offer;
    },

    allUsage(type) {
      const usage = this.offerUse && this.offerUse.usage ? this.offerUse.usage : null;
      const value =
        this.offerUse &&
        usage &&
        usage[0].envelopeValue &&
        usage.filter((o) => o.usageType === type)[0]
          ? usage.filter((o) => o.usageType === type)[0].envelopeValue
          : 0;
      if (value) {
        return this.$t(`digitalOffer.offerPackages.${type}`, {
          value,
          unit: usage.filter((o) => o.usageType === type)[0].unit,
        });
      }
      return 0;
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
    getParamsServices(services) {
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
    maxServicesShow() {
      return this.maxServices === 3 && this.isActive ? 99 : 3;
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
  min-height: 44vh;
  border: 3px solid $title-bg-color;
  &:hover,
  &:focus,
  &.active {
    border: 3px solid $blue;

    .package-title {
      background-color: $blue;
    }
  }
  &.minCard {
    max-width: 240px;
    min-height: 340px;
    .terms {
      min-height: 80px;
      padding: 1rem 2rem 0 1rem;
    }
    .subscribe-btn {
      margin: 1rem auto 0rem;
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
  .title {
    display: flex;
    justify-content: center;
    padding: 16px 24px;
    background-color: #fff;
    font-size: 1.225rem;
    color: $black;
  }

  .package-layout {
    display: flex;
    justify-content: center;
    padding: 2rem 2rem 1rem;
    padding-top: 16px;

    .package-currency {
      padding-right: 4px;
      font-size: 1.5rem;
      font-weight: 500;
      color: $text-currency;
    }

    .package-value {
      display: flex;
      align-items: center;

      .centWithPeriod {
        width: 100px;
      }

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
    padding: 0.5rem 2rem;
    font-size: 0.9125rem;
    text-align: center;
    min-height: 120px;
    &.minCard {
      min-height: 60px !important;
    }
    @media screen and (max-width: 1368px) {
      padding: 1rem 1rem;
    }
    @media screen and (max-width: 560px) {
      min-height: auto;
    }
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

  .readMore {
    text-align: center;
    font-size: 14px;
    color: $blue;
  }
  .logo {
    text-align: center;
    padding: 0.25rem;
  }
  .logo_order {
    text-align: center;
    padding-bottom: 1rem;
  }
  img {
    max-width: 70%;
    max-height: 30px;
    height: auto;
  }
}
</style>
