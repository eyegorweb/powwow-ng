<template>
  <div>
    <UiButton v-if="order.status === 'NOT_VALIDATED'" variant="accent" block @click="validate">{{ $t('orders.validate-order') }}</UiButton>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import { validateOrder } from '@/api/orders';

export default {
  props: {
    order: Object,
  },
  components: {
    UiButton,
  },

  methods: {
    async validate() {
      const orderData = await validateOrder(this.order.id);
      this.order.status = orderData.status;
    },
  },
};
</script>

<style scoped>
</style>
