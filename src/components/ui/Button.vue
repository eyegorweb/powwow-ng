<script>
export default {
  functional: true,

  props: {
    variant: {
      type: String,
      default: 'light',
    },
    type: {
      type: String,
      default: 'button',
    },
    block: Boolean,
    size: String,
  },

  render: (h, { data, props, children }) => {
    const classes = [
      'btn',
      `btn-${props.variant}`,
      props.size ? 'btn-' + props.size : '',
      props.block ? 'btn-block' : '',
    ];
    // s'assurer de propager les classes dynamiques
    if (data.class) classes.push(data.class);
    if (!data.attrs) data.attrs = {};
    data.attrs.type = props.type;
    return h('button', { ...data, class: classes }, children);
  },
};
</script>

<style lang="scss" scoped>
.btn-round-button {
  display: block;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  font-size: 1.5rem;
  color: $white;
  text-align: center;
  background: $primary;
  padding: 0 !important;
  cursor: pointer;
  &.span {
    cursor: pointer;
  }
  &:disabled {
    background: $medium-gray;
    cursor: default;
    &.span {
      cursor: default;
    }
  }
}
.btn-import {
  color: $primary;
  background: $white;
  border-color: $primary;
}

.btn-adder {
  background: $light-gray;
}
</style>
