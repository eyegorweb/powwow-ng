<template>
  <div class="container p-4">
    <slot name="prevBtn">
      <div class="buttonContainer">
        <UiButton
          v-if="!noPrev"
          variant="round-button"
          @click="$emit('prev')"
          :disabled="!canPrev"
          class="ic-Arrow-Previous-Icon prev-btn creationAccountBtn"
        />
      </div>
    </slot>
    <img class="logo--center logoSvg " src="@/assets/logo_objenious.svg" alt="Logo" />
    <slot name="nextBtn">
      <div class="buttonContainer">
        <UiButton
          v-if="!noNext"
          variant="round-button"
          @click="$emit('next')"
          :disabled="!canNext"
          class="ic-Arrow-Next-Icon next-btn creationAccountBtn"
        />
      </div>
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
@media screen and (max-width: 900px) {
  .container {
    left: 0;
    width: 100% !important;
    max-width: 100%;
    z-index: 99;
  }
}
.container {
  flex-basis: 4rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: fixed;
  background: white;
  width: 59%;
  bottom: 0;
  padding: 1rem 3rem;
  box-shadow: 0px -23px 13px -23px rgba(0, 0, 0, 0.25);

  .next-btn {
    width: 3rem;
  }

  &.reverse {
    flex-direction: row-reverse !important;
  }
}
.buttonContainer {
  width: 3rem;
  height: 3rem;
}
.logo {
  &--center {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
}
.logoSvg {
  width: 100px;
  height: 60px;
}
</style>
