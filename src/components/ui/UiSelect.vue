<template>
  <select
    class="form-control"
    v-model="model"
  >
    <slot>
      <option
        disabled
        selected
        :value="null"
      >{{ placeholder }}</option>
      <option
        v-for="option in formattedOptions"
        :key="option.value"
        :value="option.value"
      >{{ option.label }}</option>
    </slot>
  </select>
</template>

<script>
export default {
  name: 'UiSelect',
  props: {
    /* eslint-disable-next-line vue/require-prop-types */
    value: {
      required: true,
    },
    placeholder: {
      type: String,
    },
    options: {
      type: Array,
      default: () => [],
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
.form-control {
  display: inline-block;
  font-family: 'Open Sans', sans-serif;
  font-size: 0.9rem;
  border-radius: $box-radius;
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  color: inherit;
  font-size: 16px;
  border: 1px solid $medium-grey;
  width: auto;
  padding: 0.5rem 0.8rem;
  padding-right: 3rem;
  /* TODO:Utiliser la bonne icone */
  background-image: url('../../assets/arrow.svg');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right center;

  &:disabled {
    background-color: $light-grey;
  }
}
</style>
