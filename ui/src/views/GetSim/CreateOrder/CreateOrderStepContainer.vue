<template>
  <div class="order-step-container">
    <div class="order-step-content">
      <slot></slot>
    </div>
    <div v-if="!noButtons" class="order-sep-actions">
      <div class="col-md-12">
        <UiButton
          v-if="!noPreviousButton"
          variant="round-button"
          @click="$emit('prev')"
          class="float-left ic-Arrow-Previous-Icon prev-btn"
        />
        <UiButton
          v-if="!noNextButton"
          variant="round-button"
          @click="$emit('done')"
          :disabled="!canGoToNextStep"
          class="float-right ic-Arrow-Next-Icon next-btn"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';

export default {
  components: {
    UiButton,
  },
  props: {
    noPreviousButton: Boolean,
    canGoToNextStep: Boolean,
    noButtons: Boolean,
    noNextButton: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.order-step-container {
  display: flex;
  height: 86vh;
  flex-direction: column;
}
.order-step-content {
  flex-grow: 1;
  padding: 0 2rem;
  @media screen and (min-width: 1440px) {
    padding: 0 7rem;
  }
}

.order-sep-actions {
  height: 2vh;
}
</style>
