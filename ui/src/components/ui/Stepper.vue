<script>
import Tabs from './Tabs';
import StepperLabel from './StepperLabel';

export default {
  functional: true,

  props: {
    steps: {
      type: Array,
      required: true,
    },
    selectedIndex: Number,
  },

  render(h, { data, slots, props }) {
    const renderedSlots = slots();
    return h(Tabs, {
      ...data,
      class: 'stepper',
      props: {
        tabs: props.steps,
        selectedIndex: props.selectedIndex,
      },
      // Ceci est nécessaire pour pouvoir propager les scopedSlots
      // https://vuejs.org/v2/guide/render-function.html#The-Data-Object-In-Depth
      scopedSlots: {
        ...Object.keys(renderedSlots).reduce((slots, name) => {
          slots[name] = () => renderedSlots[name];
          return slots;
        }, {}),
        // on modifie le rendering des tab individuels
        default: ({ tab, id, index, selectedIndex }) =>
          h(
            StepperLabel,
            {
              key: id,
              props: { tab, index, currentIndex: selectedIndex },
            },
            tab.label
          ),
      },
    });
  },
};
</script>

<style lang="scss" scoped>
// https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors
.stepper /deep/ .tabs-bar {
  margin-bottom: 3px;
}

.stepper /deep/ .tabs-bar::after {
  content: '';
  background-color: #dddddd;
  height: 1px;
  width: 100%;
  display: block;
  position: absolute;
  bottom: -3px;
}
</style>
