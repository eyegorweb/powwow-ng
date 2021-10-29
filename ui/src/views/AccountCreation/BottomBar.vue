<template>
  <div class="btn-container" :class="{ reverse: noPrev }">
    <slot name="prevBtn">
      <UiButton
        v-if="!noPrev"
        variant="round-button"
        @click="$emit('prev')"
        :disabled="!canPrev"
        class="ic-Arrow-Previous-Icon prev-btn"
      />
    </slot>
    <slot name="nextBtn">
      <UiButton
        v-if="!noNext"
        variant="round-button"
        @click="$emit('next')"
        :disabled="!canNext"
        class="ic-Arrow-Next-Icon next-btn"
      />
    </slot>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';

export default {
  components: {
    UiButton,
  },

  props: {
    noPrev: Boolean,
    canPrev: Boolean,
    canNext: Boolean,
    noNext: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.btn-container {
  flex-basis: 4rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  &.reverse {
    flex-direction: row-reverse !important;
  }
}
</style>
