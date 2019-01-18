<template>
  <div class="simtype" :class="{ 'active': isActive }">
    <div class="simtype__item d-flex">
      <UiCheckbox
        input-type="radio"
        shape="round"
        v-model="selectedItem"
        name="simTypeOption"
        :value="item"
      />
      <div class="simTypeIfos">
        <p class="simtype__name m-0">{{ item.name }}</p>
        <p class="simtype__format m-0">{{ $t("getsim.sim-type-labels.format") }} : {{ item.format }}</p>
        <p
          class="simtype__functions m-0"
        >{{ $t("getsim.sim-type-labels.patent") }} : {{ item.patent }}</p>
        <p class="simtype__order-status m-0">Dernière commande : {{ item.lastCommand }}</p>
      </div>
    </div>
    <div class="simtype__item">
      <img src="@/assets/simtype.png">
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

  &.active {
    border: 1px solid $blue;

    .simtype__name {
      color: $blue;
    }
  }

  p {
    color: $dark-gray;
    font-size: 0.8rem;
    text-align: left;

    &.simtype__name {
      font-size: 0.9rem;
    }

    &.simtype__order-status {
      color: $gray-680;
    }
  }
}
</style>
