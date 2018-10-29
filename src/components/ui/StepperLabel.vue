<template>
  <li
    class="step-label d-flex flex-column align-items-center px-4 pb-3"
    :class="liClasses"
  >
    <div
      class="check-container rounded-circle d-flex justify-content-center align-items-center"
      :class="checkContainerClasses"
    >
      <div :class="checkContentClasses">{{ checkContent }}</div>
    </div>
    <slot />
  </li>
</template>

<script>
export default {
  name: 'StepperLabel',
  props: {
    index: {
      type: Number,
      required: true,
    },
    currentIndex: {
      type: Number,
      required: true,
    },
  },

  computed: {
    isFinished() {
      return this.index < this.currentIndex;
    },
    isCurrent() {
      return this.index === this.currentIndex;
    },
    liClasses() {
      return {
        'is-finished': this.isFinished,
        'is-current': this.isCurrent,
        'is-next': this.index > this.currentIndex,
      };
    },
    checkContainerClasses() {
      return {
        'bg-success': this.isFinished,
        'bg-primary': this.isCurrent,
        'text-muted': this.index > this.currentIndex,
      };
    },
    checkContentClasses() {
      return {
        'ic-Check-Icon': this.isFinished,
      };
    },
    checkContent() {
      return this.index < this.currentIndex ? '' : this.index + 1;
    },
  },
};
</script>

<style scoped lang="scss">
.step-label {
  display: block;
  flex-basis: 91px;

  &.is-current {
    font-weight: bold;
    border-bottom: $secondary solid 3px;
    margin-bottom: -3px;
  }
}

.check-container {
  /* defaults to  gray */
  background-color: #dddddd;
  width: 22px;
  height: 22px;
  color: white;
  /* 12px */
  font-size: 0.75rem;
  /* TODO not supported by font */
  font-weight: 200;
}
</style>
