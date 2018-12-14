<template>
  <label
    :class="{ 'has-icon': $slots.icon }"
  >
    <slot name="icon" />
    <slot name="beforeInput" />
    <input
      type="text"
      :placeholder="placeholder"
      v-bind="$attrs"
      v-model="value_"
    >
  </label>
</template>

<script>
import { propWithSync } from '@/mixins';

export default {
  name: 'UiInput',
  inheritAttrs: false,
  mixins: [propWithSync('value')],

  props: {
    placeholder: String,
  },
};
</script>

<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/border-radius';

label {
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
    border: 1px solid $medium-gray;
    width: 100%;

    &:disabled {
      background-color: $light-gray;
    }
  }

  &.has-icon input {
    padding-left: calc(0.8rem + 1.5em);
  }

  & > *:first-child {
    display: block;
    position: absolute;
    left: 0.8rem;
    width: 1em;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
