<template>
  <div class="simtype">
    <div class="simtype__item">
      <UiCheckbox
        input-type="radio"
        shape="round"
        v-model="selectedItem"
        name="simTypeOption"
        value="test"
      />
    </div>
    <div class="simtype__item">
      <p class="simtype__name m-0">SIM M2M Endurcie 076</p>
      <p class="simtype__format m-0">Format : Standard, sans PIN</p>
      <p class="simtype__functions m-0">Brevets et fonctionnalités : Best network + Smart Roaming</p>
      <p class="simtype__order-status m-0">Dernière commande : 27/09/18</p>
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
    defaultSelectedItem: {
      type: [String, Array, Object],
    },
  },
  data() {
    return {
      result: '',
    };
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
  align-items: stretch;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 10px 20px 10px 15px;
  margin-bottom: 10px;

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
