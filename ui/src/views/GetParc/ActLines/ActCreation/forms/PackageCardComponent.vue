<template>
  <div class="pricing-table" :class="[{ active: isActive }]">
    <div class="package-title" v-if="pack" :class="isActive ? 'active' : ''">
      <span>{{ $loGet(pack, 'label', '-') }}</span>
    </div>
    <div class="terms">
      <div class="term details">
        <ul class="list-group">
          <li class="list-group-item" v-for="u in pack.usage" :key="u.label">
            {{ u.type }}: {{ u.value }} {{ u.unit }}
          </li>
        </ul>
      </div>
    </div>
    <template>
      <button class="subscribe-btn" @click="onClick()">
        <span> {{ $t('select') }}</span>
      </button>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    pack: Object,
    isActive: Boolean,
    recharge: Boolean,
    readMore: Boolean,
  },
  methods: {
    onClick() {
      this.$emit('select:pack', this.pack);
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
  min-height: 30vh;
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
    padding: 1rem 2rem;
    font-size: 0.9125rem;
    text-align: center;
    min-height: 170px;
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
  .list-group-item {
    border: none;
  }
}
</style>
