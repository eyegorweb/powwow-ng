<template>
  <div class="select-container">
    <select
      class="form-control"
      v-model="model"
      :class="{ 'arrow-blue': arrowBlue, error: !!error }"
      :size="numberOfVisibleItems"
    >
      <slot>
        <option v-if="placeholder" disabled selected :value="null">{{ placeholder }}</option>
        <option v-for="option in formattedOptions" :key="option.value" :value="option.value">{{
          option.label
        }}</option>
      </slot>
    </select>
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
  },
  computed: {
    formattedOptions() {
      return this.options.map(o => (typeof o === 'string' ? { value: o, label: o } : o));
    },
    model: {
      get: ({ value }) => value,
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
.form-control {
  display: inline-block;
  font-family: 'Open Sans', sans-serif;
  font-size: 0.9rem;
  border-radius: $box-radius;
  width: 100%;
}

.select-container {
  display: inline-block;
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  color: inherit;
  font-size: 16px;
  border: 1px solid $medium-gray;
  width: auto;
  padding: 0.5rem 0.8rem;
  padding-right: 3rem;
  /* TODO:Utiliser la bonne icone */
  background-image: url('../../assets/arrow.svg');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right center;

  &:disabled {
    background-color: $light-gray;
  }
}

.arrow-blue {
  background-image: url('../../assets/arrow-blue.svg');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right center;
}
</style>
