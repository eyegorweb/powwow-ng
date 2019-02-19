<template>
  <div class="order-status">
    <div>
      <CheckMark :is-error="isError" />
    </div>
    <div class="label" :class="{'error': isError}">
      {{ $t('col.statuses.' + item) }}
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
    item: {
      type: String,
    },
  },

  computed: {
    isError() {
      return this.item === 'NOT_VALIDATED';
    },
  },
};
</script>

<style lang="scss" scoped>
.order-status {
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
  clear: both;
}
</style>
