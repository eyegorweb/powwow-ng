<template>
  <label :class="{ 'has-icon': $slots.icon }">
    <input placeholder="../../...." type="text" v-bind="$attrs" ref="dateValue" />
    <slot name="icon" />
  </label>
</template>

<script>
// DEPRECATED to be replaced with UiDate2 next sprint
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { propWithSync } from '@/mixins';
import { French } from 'flatpickr/dist/l10n/fr.js';

export default {
  name: 'UiDate',

  mixins: [propWithSync('dateValue')],

  mounted() {
    this.createFlatpickr();
  },

  methods: {
    onChange([dateValue]) {
      this.dateValue_ = dateValue;
    },

    createFlatpickr() {
      this.fp = flatpickr(this.$refs.dateValue, {
        dateFormat: 'd/m/y',
        allowInput: true,
        // closeOnSelect: false,
        onChange: this.onChange,
        locale: French,
      });
    },
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

  & > *:last-child {
    display: block;
    position: absolute;
    right: 1rem;
    transform: translateY(-50%);
    top: 50%;
  }
}
</style>
