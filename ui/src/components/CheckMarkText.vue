<template>
  <div class="status">
    <CheckMark :is-error="isError" />
    <div class="label" :class="{ error: isError }">
      <slot />
    </div>
  </div>
</template>

<script>
import CheckMark from '@/components/ui/CheckMark';

export default {
  components: {
    CheckMark,
  },
  props: {
    isError: Boolean,
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/scss/mixins/_circle.scss';

.status {
  div {
    float: left;
    &.label {
      padding: 0.25rem 0.4rem;
      color: $success;
      &.error {
        color: $orange;
      }
    }
  }

  .circle {
    @include circle;
  }
  clear: both;
}
</style>
