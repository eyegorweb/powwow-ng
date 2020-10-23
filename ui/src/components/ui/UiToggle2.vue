<template>
  <div
    class="d-flex"
    :class="{
      'slim-toggles': slimToggles,
      'light-theme': lightTheme,
      'justify-content-center': center,
    }"
  >
    <div class="item toggle" :class="{ 'block-toggles': block }">
      <button
        v-for="item in values"
        :key="item.id"
        @click="chosenValue = item"
        :class="{ active: item === chosenValue }"
        :disabled="disabled"
      >
        <template v-if="noTranslation">
          {{ item.label }}
        </template>
        <template v-else>
          {{ $t(item.label) }}
        </template>
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
    slimToggles: Boolean,
    lightTheme: {
      type: Boolean,
      default: false,
    },
    block: Boolean,
    disabled: Boolean,
    noTranslation: Boolean,
    center: Boolean,
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
    border: 1px solid $primary;
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

.light-theme {
  .toggle {
    display: flex;
    align-content: stretch;
    width: 100%;
    button {
      border: 1px solid $gray-400;
      border-left: none;
      font-size: 1rem;
      padding: 1rem;
      color: $dark-gray;
      &:focus {
        outline: none;
      }
      &.active {
        background-color: $primary;
        border-color: $primary;
        border-radius: 0;
        color: $white;
        outline: none;
      }

      &:first-child {
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
        margin-left: 0px;
        border-left: 1px solid $gray-400;
      }
      &:last-child {
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
      }
    }
  }
}

.slim-toggles /deep/ button {
  padding: 0px 20px;
}

.block-toggles {
  width: 100%;
  display: flex;
}
</style>
