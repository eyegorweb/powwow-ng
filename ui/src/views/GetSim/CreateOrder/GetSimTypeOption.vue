<template>
  <div class="simtype" :class="{ active: isActive }">
    <div class="simtype__item d-flex">
      <UiCheckbox
        input-type="radio"
        shape="round"
        v-model="selectedItem"
        name="simTypeOption"
        :value="item"
      />
      <div class="simTypeIfos">
        <p class="simtype__info simtype__name m-0">
          {{ item.simCard.name }}
          <span v-if="item.simCard.type === 'TAPE'"
            >({{ $t('getsim.tape') }} {{ item.simCard.number }})</span
          >
        </p>
        <p class="simtype__info m-0">
          {{ $t('getsim.sim-type-labels.format') }}: {{ item.simCard.format }}
        </p>
        <p class="simtype__info m-0">
          {{ $t('getsim.sim-type-labels.licence') }}: {{ item.simCard.licence }}
        </p>
        <p class="simtype__info m-0" v-if="formattedPriceHT">
          {{ $t('price') }}: {{ formatCurrency(formattedPriceHT) }} €
        </p>
        <p v-if="item.orderDate" class="last-order mt-1">
          {{ $t(lastActionKey) }}: {{ formattedDate }}
        </p>
        <p v-else class="last-order mt-1">{{ $t(noActionKey) }}</p>
      </div>
    </div>
    <div class="simtype__item simtype__img">
      <img src="@/assets/simtype.png" />
    </div>
  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';
import { formatCurrency } from '@/utils/numbers.js';

export default {
  name: 'GetSimTypeOption',
  props: {
    item: {
      type: Object,
    },
    isAlone: {
      type: Boolean,
    },
    defaultSelectedItem: {
      type: [String, Array, Object],
    },
    isActive: {
      type: Boolean,
    },
    lastActionKey: String,
    noActionKey: String,
  },
  methods: {
    formatCurrency(value) {
      return formatCurrency(value);
    },
  },
  computed: {
    formattedDate() {
      return this.item.orderDate.replace(/-/g, '/');
    },
    selectedItem: {
      get() {
        return !this.defaultSelectedItem && this.isAlone ? this.item : this.defaultSelectedItem;
      },
      set(newSelected) {
        this.$emit('update:defaultSelectedItem', newSelected);
      },
    },
    formattedPriceHT() {
      return this.$loGet(this.item, 'buyingPriceInEuroCentHT', 0) / 100;
    },
  },
  components: {
    UiCheckbox,
  },
};
</script>

<style lang="scss" scoped>
.simtype {
  border: 1px solid $medium-gray;
  border-radius: 0.2rem;
  align-items: stretch;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding: 10px 20px 10px 15px;
  margin-bottom: 10px;
  min-height: 90px;

  &__item {
    width: 85%;
  }

  &__img {
    width: 60px;
  }

  &.active {
    border: 1px solid $blue;

    .simtype__info {
      color: $blue;
    }
  }

  p {
    color: $dark-gray;
    font-size: 0.8rem;
    text-align: left;

    &.simtype__info {
      font-size: 0.9rem;
    }

    &.simtype__order-status {
      color: $gray-680;
    }

    &.last-order {
      font-size: 0.8rem;
      color: $gray-680;
    }
  }

  img {
    max-width: 100%;
    max-height: 100%;
    float: right;
  }
}
</style>
