<template>
  <div
    class="form-group"
    :class="[fieldWidth, isDisabled && 'form-group--disabled']"
  >
    <select
      class="form-control form-control--right-radius"
      :disabled="isDisabled"
    >
      <option
        disabled
        selected
      >{{ fieldName }}</option>
      <option
        v-for="fieldOption in fieldOptions"
        :key="fieldName + fieldOption"
      >{{ fieldOption }}
      </option>
    </select>
    <i class="select-icon ic-Arrow-Down-Icon" />
  </div>
</template>

<script>
export default {
  name: 'InputSelect',
  props: {
    isDisabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    fieldWidth: {
      type: String,
      required: false,
      default: 'form-group--medium',
    },
    fieldName: {
      type: String,
      required: true,
    },
    fieldOptions: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.form-control {
  display: inline-block;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  border-radius: 0;

  &--left-radius {
    border-radius: 2px 0 0 2px;
  }

  &--right-radius {
    border-radius: 0 2px 2px 0;
  }
}

.form-group {
  position: relative;
  color: $dark-grey;

  &--disabled {
    color: $dark-grey;
  }

  &--small {
    width: 240px;
  }

  &--medium {
    width: 480px;
  }
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  color: inherit;
  font-size: 16px;
  border: 1px solid $medium-grey;
  width: 100%;

  &:disabled {
    background-color: $light-grey;
  }

  &:focus {
    outline: none;
  }
}

.select-icon {
  pointer-events: none;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
