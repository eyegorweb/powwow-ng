<template>
  <div class="status">
    <CheckMark v-if="!noCheck" :is-error="isError" />
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
    /**
     * ERROR
     * SUCCESS
     */
    state: String,
    noCheck: Boolean,
  },
  computed: {
    isError() {
      return this.state === 'ERROR';
    },
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
