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
    data.attrs.type = props.type;
    return h('button', { ...data, class: classes }, children);
  },
};
