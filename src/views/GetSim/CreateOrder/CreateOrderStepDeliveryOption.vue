<template>
  <div class="adress" :class="{ 'active': isActive }">
    <div class="adress__item d-flex">
      <UiCheckbox
        input-type="radio"
        shape="round"
        v-model="selectedItem"
        name="simTypeOption"
        :value="item"
      />
      <div class="simTypeIfos">
        <p class="adress__name m-0">{{ item.title }}</p>
        <p class="adress__format m-0">{{ $t("getsim.sim-type-labels.format") }} : {{ item.description }}</p>
        <div>
          <a href="#" class="float-right">Modifier</a>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';

export default {
  name: 'CreateOrderStepDeliveryOption',
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
.adress {
  border: 1px solid $medium-gray;
  border-radius: 0.2rem;
  align-items: stretch;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding: 10px 20px 10px 15px;
  margin-bottom: 10px;
  min-height: 90px;

  &.active {
    border: 1px solid $blue;

    .adress__name {
      color: $blue;
    }
  }

  p {
    color: $dark-gray;
    font-size: 0.8rem;
    text-align: left;

    &.adress__name {
      font-size: 0.9rem;
    }

    &.adress__order-status {
      color: $gray-680;
    }
  }
}
</style>
