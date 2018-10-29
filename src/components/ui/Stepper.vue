<template>
  <div class="stepper">
    <ol class="steps-bar d-flex justify-content-around pt-2">
      <StepperLabel
        :key="step.label"
        v-for="(step, i) in steps"
        :index="i"
        :current-index="selectedStep"
      >{{ step.label }}</StepperLabel>
    </ol>
    <hr class="divider">
    <div class="step-content">
      <slot :name="selectedStepName">selected step: {{ selectedStep }}</slot>
    </div>
  </div>
</template>

<script>
import StepperLabel from './StepperLabel';

export default {
  data() {
    return {
      selectedStep: 2,
    };
  },

  props: {
    steps: {
      type: Array,
      required: true,
    },
  },

  computed: {
    selectedStepName() {
      // return default if the step isn't good
      if (this.selectedStep < 0 || this.selectedStep >= this.steps.length) return 'default';
      return this.steps[this.selectedStep].label;
    },
  },

  components: { StepperLabel },
};
</script>

<style scoped>
.steps-bar {
  list-style: none;
  /* 14px */
  font-size: 0.875rem;
  margin-bottom: 0;
  padding-inline-start: 0;
}
.divider {
  margin-top: 3px;
}
</style>
