<template>
  <div class="toggle" :class="[label ? 'with-label' : 'without-label', statusClassName]">
    <div v-if="label" class="before-label">
      <p class="before-label__label">{{ label }}</p>
      <p class="before-label__dots" />
    </div>
    <label>
      <input type="checkbox" v-bind="$attrs" v-model="model" />
      <span class="slider" />
      <span class="state state--on">On</span>
      <span class="state state--off">Off</span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'Toggle',
  model: {
    prop: 'checked',
    event: 'change',
  },

  props: {
    checked: {
      type: Boolean,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    model: {
      get: ({ checked }) => {
        return checked;
      },
      set(model) {
        this.$emit('change', model);
      },
    },
    statusClassName() {
      // gestion de l'état par défaut, "enabled" ou "disabled"
      if (this.editable) {
        return '';
      } else {
        return this.checked ? 'enabled' : 'disabled';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.toggle {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  max-width: 220px;

  &.without-label {
    justify-content: flex-start;
  }

  .before-label {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    width: 65%;
    max-width: 140px;
    overflow: hidden;

    &__label {
      color: $dark-gray;
      margin: 0;
      font-size: 14px;
    }

    &__dots {
      color: $dark-gray;
      margin: 0;
      font-size: 14px;
      flex-grow: 3;
      overflow: hidden;
      position: relative;

      &::after {
        content: '..............................................';
        display: block;
        position: absolute;
        left: 5px;
        bottom: 0;
        color: $dark-gray;
        margin: 0;
        font-size: 14px;
      }
    }
  }

  label {
    position: relative;
    display: inline-block;
    width: 56px;
    height: 16px;
    margin-bottom: 0;

    &:hover {
      cursor: pointer;
    }
  }

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  input:checked + .slider {
    background-color: $success;
  }

  input:checked + .slider:before {
    transition: 0.4s;
    background-color: $white;
    transform: translateX(calc(100% + 6px));
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $gray-400;
    border-radius: 34px;
    transition: 0.4s;

    &:before {
      position: absolute;
      content: '';
      height: 25px;
      width: 25px;
      left: 0;
      bottom: -4px;
      background-color: $light-gray;
      border-radius: 50%;
      box-shadow: 0px 0px 10px 3px rgba(189, 189, 189, 0.45);
      transition: 0.4s;
    }
  }

  .state {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 10px;
    text-transform: uppercase;
    color: $white;
    user-select: none;

    &--on {
      left: 8px;
    }

    &--off {
      right: 8px;
    }
  }

  &.enabled {
    pointer-events: none;

    .slider {
      background-color: $success;
    }

    .slider:before {
      display: none;
    }

    .state--on {
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .state--off {
      display: none;
    }
  }

  &.disabled {
    pointer-events: none;

    .slider:before {
      display: none;
    }

    .state--off {
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .state--on {
      display: none;
    }
  }
}
</style>
