<template>
  <div class="orderStepContainer">
    <div class="orderStepContent" :class="{ wide: wide }">
      <slot></slot>
    </div>
    <div v-if="!noButtons" class="orderStepButtons">
      <div>
        <UiButton
          v-if="!noPreviousButton"
          variant="round-button"
          @click="$emit('prev')"
          class="ic-Arrow-Previous-Icon prev-btn"
        />
      </div>
      <div>
        <UiButton
          v-if="!noNextButton"
          variant="round-button"
          @click="$emit('done')"
          :disabled="!canGoToNextStep"
          class="ic-Arrow-Next-Icon next-btn"
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
    wide: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.orderStepContainer {
  display: flex;
  flex-direction: column;
  height: 100%;

  .orderStepContent {
    flex-grow: 1;
    padding: 0 7rem;
    
    @media only screen and (max-width: 700px) {
        padding: 0 1rem;
    }
  }

  .orderStepButtons {
    flex-basis: 4rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}

.wide {
  padding: 0 !important;
}
</style>
