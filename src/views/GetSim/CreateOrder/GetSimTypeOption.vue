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
        <p class="simtype__info simtype__name m-0">{{ item.simCard.name }}</p>
        <p class="simtype__info m-0">
          {{ $t('getsim.sim-type-labels.format') }}: {{ item.simCard.format }}
        </p>
        <p class="simtype__info m-0">
          {{ $t('getsim.sim-type-labels.licence') }}: {{ item.simCard.licence }}
        </p>
        <p class="last-order mt-1">
          {{ $t('getsim.sim-type-labels.orderDate') }}: {{ item.orderDate }}
        </p>
      </div>
    </div>
    <div class="simtype__item">
      <img src="@/assets/simtype.png" />
    </div>
  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';

export default {
  name: 'GetSimTypeOption',
  props: {
    item: {
      type: Object,
    },
    defaultSelectedItem: {
      type: [String, Array, Object],
    },
    isActive: {
      type: Boolean,
    },
  },
  computed: {
    selectedItem: {
      get() {
        return this.defaultSelectedItem;
      },
      set(newSelected) {
        this.$emit('update:defaultSelectedItem', newSelected);
      },
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

  @media screen and (max-height: 900px) {
    max-height: 40px;
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
    max-height: 100%;
  }
}
</style>
