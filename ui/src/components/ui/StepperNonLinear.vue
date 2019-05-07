<template>
  <div class="stepper">
    <StepperNonLinearStep
      v-for="(step, i) in stepperData.data"
      :key="step.label"
      :label="step.label"
      :date="step.date"
      :current-index="currentIndex"
      :index="i"
      :is-error="step.statusError"
    />
  </div>
</template>

<script>
import StepperNonLinearStep from '@/components/ui/StepperNonLinearStep';

export default {
  props: {
    stepperData: Object,
    currentIndex: Number,
  },
  components: {
    StepperNonLinearStep,
  },
};
</script>

<style lang="scss" scoped>
.stepper {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 0;
  margin: 0;
}
</style>
