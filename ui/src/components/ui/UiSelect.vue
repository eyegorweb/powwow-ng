<template>
  <div class="select-container">
    <div class="select" :class="{ 'small-format': small }">
      <select
        class="form-control"
        v-model="model"
        :class="{ 'arrow-blue': arrowBlue, error: !!error }"
        :size="numberOfVisibleItems"
      >
        <slot>
          <option v-if="placeholder" disabled selected hidden value="none">
            {{ placeholder }}
          </option>
          <option
            v-for="option in formattedOptions"
            :key="option.value"
            :value="option.value"
            :disabled="option.disabled"
            >{{ option.label }}</option
          >
        </slot>
      </select>
    </div>
    <span v-if="error" class="error-text">{{ $t(error) }}</span>
  </div>
</template>

<script>
export default {
  name: 'UiSelect',
  props: {
    /* eslint-disable-next-line vue/require-prop-types */
    value: {
      required: false,
    },
    placeholder: {
      type: String,
    },
    options: {
      type: Array,
      default: () => [],
    },
    numberOfVisibleItems: {
      type: Number,
      required: false,
      default: 0,
    },
    arrowBlue: {
      type: Boolean,
    },
    error: {
      type: String,
      required: false,
    },
    small: Boolean,
  },
  computed: {
    formattedOptions() {
      return this.options.map(o => (typeof o === 'string' ? { value: o, label: o } : o));
    },
    model: {
      get: ({ value }) => {
        return value || 'none';
      },
      set(model) {
        this.$emit('input', model);
      },
    },
  },
};
</script>

<style scoped lang="scss">
.error {
  border: 1px solid $orange;
  border-radius: 3px;
}

.select-container {
  display: inline-block;
}

select {
  padding: 0.55rem 0.8rem;
  padding-right: 0 !important;
  border-radius: 0;
}

.small-format {
  select {
    padding: 0;
    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
      'Noto Color Emoji';
    font-weight: 500;
    border: none;
  }
}
</style>
