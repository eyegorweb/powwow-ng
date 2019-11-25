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

  .item {
    display: flex !important;
    flex: 0 0 100% !important;
  }

  button {
    appearance: none;
    border: 2px solid $primary;
    background-color: transparent;
    // border-radius: 5px;
    font-weight: bold;
    font-size: 0.8rem;
    color: $primary;
    padding: 5px 20px;
    margin-left: -2px;
    flex: 1;

    &.active {
      background-color: $primary;
      color: $white;
      transition: all 0.2s;
    }

    &:first-child {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      margin-left: 0px;
    }
    &:last-child {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }
}
</style>
