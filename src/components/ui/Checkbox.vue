<template>
  <label class="checkbox-container"> <slot />
    <input
      type="checkbox"
      v-bind="$attrs"
      v-model="model"
      :value="value"
    >
    <span
      class="checkmark"
      :class="shape"
    />
  </label>
</template>

<script>
export default {
  name: 'Checkbox',
  model: {
    prop: 'checked',
    event: 'change',
  },

  props: {
    checked: [Boolean, Array],
    shape: {
      type: String,
      default: 'regular',
    },
    value: {
      type: [Object, Array, String],
      required: false,
    },
  },

  computed: {
    model: {
      get: ({ checked }) => checked,
      set(model) {
        this.$emit('change', model);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.checkbox-container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  user-select: none;
  input {
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  input:checked ~ .checkmark:after {
    display: block;
  }

  input:checked + span.round {
    background-color: $blue;
    border: 1px solid $blue;
  }

  input + span.round {
    background-color: $white;
    border: 1px solid $medium-grey;
  }
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  border: 1px solid $blue;
  border-radius: 3px;

  &.regular {
    background-color: $white;
  }

  &.solid {
    background-color: $blue;
  }

  &:after {
    content: '';
    position: absolute;
    display: none;
  }

  &.regular:after {
    left: 9px;
    top: 4px;
    width: 5px;
    height: 12px;
    border: solid $blue;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  &.solid:after {
    left: 6px;
    top: 10px;
    width: 11px;
    border: solid $white;
    border-width: 0 2px 2px 0;
  }

  &.round {
    border-radius: 50%;
    cursor: pointer;
    width: 28px;
    height: 28px;
    left: 0;
    position: absolute;
    top: 0;
  }

  &.round:after {
    left: 10px;
    top: 5px;
    width: 6px;
    height: 12px;
    border: solid $white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
}
</style>
