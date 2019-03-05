<template>
  <div>
    <UiButton variant="accent" block>{{ $t('orders.validate-order') }}</UiButton>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';

export default {
  props: {
    order: Object,
  },
  components: {
    UiButton,
  },
};
</script>

<style scoped>
</style>
