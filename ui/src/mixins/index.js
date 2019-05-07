export function propWithSync(name, event, options, computedName) {
  options = options || { required: true };
  event = event || `update:${name}`;
  computedName = computedName || name + '_';

  return {
    model: {
      prop: name,
      event,
    },

    props: {
      [name]: options,
    },

    computed: {
      [computedName]: {
        get: vm => vm[name],
        set(value) {
          this.$emit(event, value);
        },
      },
    },
  };
}
