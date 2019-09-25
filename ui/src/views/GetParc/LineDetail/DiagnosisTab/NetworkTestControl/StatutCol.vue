<template>
  <div class="order-status mock-value">
    <CheckMark :is-error="isError" />
    <div class="label mock-value" :class="{ error: isError }">
      {{ $t('col.statuses.TERMINATED') }}
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
    row: Object,
  },
  data() {
    return {
      isError: false,
    };
  },
};
</script>

<style lang="scss" scoped></style>
