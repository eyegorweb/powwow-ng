<template>
  <div class="d-flex toggle">
    <div class="item">
      <button
        v-for="item in values"
        :key="item.id"
        @click="chosenValue = item"
        :class="{ active: item === chosenValue }"
      >
        {{ $t(item.label) }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chosenValue: undefined,
    };
  },
  mounted() {
    this.chosenValue = this.values.find(i => i.default == true);
    if (!this.noDefault && !this.chosenValue) {
      this.chosenValue = this.values[0];
    }
  },
  watch: {
    chosenValue(newVal) {
      this.$emit('update', newVal);
    },
  },
  props: {
    noDefault: Boolean,
    values: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.toggle {
  color: $gray-680;

  button {
    appearance: none;
    border: 2px solid $primary;
    background-color: transparent;
    border-radius: 5px;
    font-weight: bold;
    font-size: 0.8rem;
    color: $primary;
    padding: 5px 20px;

    &.active {
      background-color: $primary;
      color: $white;
      transition: all 0.2s;
    }

    &:first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    &:last-child {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>
