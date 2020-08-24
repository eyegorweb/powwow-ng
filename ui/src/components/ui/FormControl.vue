<template>
  <div class="form-group" :class="{ error: !!error }">
    <label>{{ $t(label) }}</label>
    <slot>
      <input
        v-if="inputType === 'number'"
        :placeholder="placeholder"
        v-bind="$attrs"
        v-model="value_"
        :required="required"
        type="number"
        class="form-control"
        :class="{ 'big-input': big }"
      />
      <input
        v-else
        :placeholder="placeholder"
        v-bind="$attrs"
        v-model="value_"
        v-on="$listeners"
        :type="inputType"
        :maxlength="maxSize"
        :required="required"
        class="form-control"
        :class="{ 'big-input': big }"
      />
      <small v-if="error" class="form-text error-text">{{ $t(error) }}</small>
      <small v-if="required" class="form-text error-text">{{ $t('required') }}</small>
    </slot>
  </div>
</template>

<script>
import { propWithSync } from '@/mixins';

export default {
  name: 'FormControl',
  inheritAttrs: false,
  mixins: [propWithSync('value', 'update:value', { required: false })],

  props: {
    label: String,
    placeholder: {
      type: [String, Number],
      required: false,
    },
    inputType: {
      type: String,
      required: false,
      default: 'text',
    },
    error: {
      type: String,
      required: false,
    },
    required: Boolean,
    big: Boolean,
    maxSize: {
      type: Number,
      required: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.form-group {
  &.error input {
    border: 1px solid $orange;
    border-radius: 3px;
  }
  .error-text {
    color: $orange;
  }
}

.big-input {
  font-size: 1.5rem;
}
</style>
