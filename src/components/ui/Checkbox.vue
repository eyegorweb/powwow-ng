<template>
  <div class="checkbox-container">
    <label>
      <slot />
      <input
        type="checkbox"
        v-bind="$attrs"
        v-model="model"
        :value="value"
      >
      <span
        class="checkmark"
        :class="isIndeterminate ? 'indeterminate' : shape"
      />
    </label>
  </div>
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
      get: ({ checked, value }) => {
        // cas indeterminate
        // si value est un tableau, on retourne true si checked (qui est lui aussi un tableau)
        // contient tous les elements de value
        if (Array.isArray(value)) return value.every(v => checked.includes(v));
        return checked;
      },
      set(model) {
        // cas indeterminate
        // model == true -> on veut la totalité du tableau dans checked
        // model = false -> on le vide
        this.$emit('change', Array.isArray(this.value) ? (model ? this.value.slice() : []) : model);
      },
    },
    isIndeterminate({ value, checked }) {
      if (!Array.isArray(value)) return false;
      const selectedCount = value.filter(v => checked.includes(v)).length;
      return selectedCount > 0 && selectedCount < value.length;
    },
  },
};
</script>

<style lang="scss" scoped>
.checkbox-container {
  display: block;

  label {
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    user-select: none;
  }

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
    border: 1px solid $medium-gray;
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

  &.indeterminate {
    background-color: $secondary;

    &::after {
      content: '';
      display: block;
      width: 57%;
      height: 2px;
      background-color: $white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
