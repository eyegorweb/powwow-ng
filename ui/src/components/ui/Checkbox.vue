<template>
  <div class="checkbox-container">
    <label :key="version" :class="{ filled: 'filled' }">
      <slot />
      <input
        v-if="inputType === 'radio'"
        type="radio"
        v-bind="$attrs"
        v-model="model"
        :value="value"
        :name="name"
      />
      <input v-else type="checkbox" v-bind="$attrs" v-model="model" :value="value" />
      <span class="checkmark" :class="isIndeterminate ? 'indeterminate' : shape" />
    </label>
  </div>
</template>

<script>
import isEqual from 'lodash.isequal';

export default {
  name: 'Checkbox',
  model: {
    prop: 'checked',
    event: 'change',
  },

  props: {
    checked: [Boolean, Array, Object, String],
    shape: {
      type: String,
      default: 'regular',
    },
    value: {
      type: [Object, Array, String],
      required: false,
    },
    inputType: {
      type: String,
      required: false,
      default: 'text',
    },
    name: {
      type: String,
      required: false,
      default: '',
    },
    filled: {
      type: Boolean,
      required: false,
    },
  },

  data() {
    return {
      /**
       * je ne comprends pas pourquoi se recoche des fois.
       * avec cette variable on s'assure que le composant représente le model
       */
      version: 0,
    };
  },
  watch: {
    model() {
      this.version += 1;
    },
  },

  computed: {
    model: {
      get: ({ checked, value }) => {
        // cas indeterminate
        // si value est un tableau, on retourne true si checked (qui est lui aussi un tableau)
        // contient tous les elements de value
        if (Array.isArray(value)) {
          return value.every(v => checked.find(s => isEqual(v, s)));
        }
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
    padding-top: 5px;
    cursor: pointer;
    user-select: none;
  }

  input {
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;

    &:disabled + .checkmark {
      background: $gray-400;
      border-color: $gray-680;
      &:after {
        border-color: $gray-680;
      }
    }
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

label.filled {
  input:checked + span.round {
    background-color: $white;
    border: 1px solid $blue;
  }

  .checkmark {
    &.round:after {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 15px;
      height: 15px;
      background-color: $secondary;
      border: none;
      border-radius: 50%;
    }
  }
}
</style>
