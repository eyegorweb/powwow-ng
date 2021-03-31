<template>
  <CreateOrderStepContainer @done="done" @prev="prev" :can-go-to-next-step="!!canGoToNextStep">
    <div>WIP</div>
  </CreateOrderStepContainer>
</template>

<script>
import CreateOrderStepContainer from '@/views/GetSim/CreateOrder/CreateOrderStepContainer.vue';

export default {
  components: {
    CreateOrderStepContainer,
  },
  computed: {
    canGoToNextStep() {
      return true;
    },
  },
  methods: {
    getSynthesis() {
      return {
        pairing: {},
      };
    },
    done() {
      if (this.canGoToNextStep) {
        this.$emit('done', this.getSynthesis());
      }
    },
    prev() {
      this.$emit('prev', this.getSynthesis());
    },
  },
};
</script>

<style lang="scss" scoped></style>
