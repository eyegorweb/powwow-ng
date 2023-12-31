<template>
  <label
    class="cmp-ui-input"
    :class="{
      'has-icon': $slots.icon,
      error: !!error,
      'no-hover-style': noHoverStyle,
      'full-width': block,
    }"
  >
    <slot name="icon" />
    <slot name="beforeInput" />
    <input
      v-if="inputType === 'number'"
      :placeholder="placeholder"
      :class="{ noNumberArrows: noNumberArrows, haveCrossButton: haveCrossButton }"
      v-bind="$attrs"
      v-model="value_"
      type="number"
      :style="inputStyle"
      :min="positiveNumber ? 0 : minValue"
      :max="maxValue"
      :onkeyup="onKeyUpFn"
      :disabled="disabled"
    />
    <input
      v-else
      :placeholder="placeholder"
      :class="{ haveCrossButton: haveCrossButton }"
      v-bind="$attrs"
      v-model="value_"
      v-on="$listeners"
      :style="inputStyle"
      type="text"
      :maxlength="maxSize"
      :disabled="disabled"
    />
    <a v-if="haveCrossButton && value_" @click.prevent="resetValue" class="btn">
      <i class="select-icon ic-Cross-Icon"></i>
    </a>

    <slot name="afterInput" />
    <div v-if="error" class="error-text">{{ $t(error) }}</div>
    <div v-if="boundsError" class="error-text">
      {{ $t('errors.boundsError', { min: minValue, max: maxValue }) }}
    </div>
    <div v-if="minValueError" class="error-text">
      {{ $t('errors.minValueError', { min: minValue }) }}
    </div>
  </label>
</template>

<script>
import { propWithSync } from '@/mixins';

export default {
  name: 'UiInput',
  inheritAttrs: false,
  mixins: [propWithSync('value', 'update:value', { required: false })],

  data() {
    return {
      boundsError: false,
      minValueError: false,
    };
  },

  props: {
    placeholder: {
      type: [String, Number],
      required: false,
    },
    inputType: {
      type: String,
      required: false,
      default: 'text',
    },
    minValue: {
      type: Number,
      required: false,
    },
    maxValue: {
      type: Number,
      required: false,
    },
    error: {
      type: String,
      required: false,
    },
    inputStyle: {
      type: Object,
      required: false,
    },
    noHoverStyle: Boolean,
    haveCrossButton: Boolean,
    noNumberArrows: Boolean,
    positiveNumber: Boolean,
    block: Boolean,
    maxSize: Number,
    disabled: Boolean,
  },

  mounted() {
    this.checkIfValueIsBetweenBounds(this.value_);
    this.checkIfValueGtMinValue(this.value_);
  },

  watch: {
    value_(newValue, oldValue) {
      // if (newValue === '') {
      //   this.boundsError = true;
      //   return;
      // }
      if (newValue != oldValue) {
        this.checkIfValueIsBetweenBounds(newValue);
        this.checkIfValueGtMinValue(newValue);
      }
    },
  },

  computed: {
    onKeyUpFn() {
      if (this.positiveNumber) {
        return 'if(this.value<0){this.value=this.value * -1}';
      }

      return '';
    },
  },

  methods: {
    resetValue() {
      this.$emit('update:value', '');
    },
    checkIfValueIsBetweenBounds(newValue) {
      if (this.minValue !== undefined && this.maxValue !== undefined) {
        if (parseFloat(newValue) < this.minValue || parseFloat(newValue) > this.maxValue) {
          this.boundsError = true;
        } else {
          this.boundsError = false;
        }
      }
    },
    checkIfValueGtMinValue(newValue) {
      if (this.minValue !== undefined && this.maxValue == undefined) {
        if (parseFloat(newValue) <= this.minValue) {
          this.minValueError = true;
        } else {
          this.minValueError = false;
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/border-radius';

.haveCrossButton {
  padding-right: 30px;
}
.ic-Cross-Icon {
  background-color: white;
  padding: 5px 3px;
}
label {
  &.error input {
    border: 1px solid $orange;
    border-radius: 3px;
  }
  position: relative;

  .input-group > &:not(:last-child) {
    @include border-right-radius(0);
  }

  .input-group > &:not(:first-child) {
    @include border-left-radius(0);
  }

  .input-group > & + & {
    margin-left: -$input-border-width;
  }

  input {
    padding: 0.5rem 0.8rem;
    border-radius: $box-radius;
    border: 1px solid $gray-400;
    width: 100%;

    &:disabled {
      background-color: $light-gray;
    }

    &::placeholder {
      font-size: 0.7rem;
    }
  }

  &.no-hover-style {
    input,
    input:hover,
    input:focus,
    input:active {
      border: none !important;
      outline: none;
    }
  }

  &.has-icon input {
    padding-left: calc(0.8rem + 1.5em);
  }

  & > *:not(input):first-child {
    display: block;
    position: absolute;
    left: 0.8rem;
    width: 1em;
    top: 50%;
    transform: translateY(-50%);
  }

  a {
    display: block;
    position: absolute;
    right: 0.8rem;
    width: 1em;
    top: 50%;
    transform: translateY(-50%);
    font-weight: 900 !important;
    padding: 0;
    padding-right: 5px;

    &:hover {
      cursor: pointer;
    }
  }
}

.noNumberArrows {
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
  -moz-appearance: textfield; /* Firefox */
}

.full-width {
  width: 100%;
}
</style>
