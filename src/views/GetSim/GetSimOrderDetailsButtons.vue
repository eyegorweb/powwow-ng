<template>
  <div class="action-buttons">
    <div v-if="statusIn(['NOT_VALIDATED'])">
      <UiButton variant="accent" block @click="updateStatus('VALIDATED')">{{ $t('getsim.actions.VALIDATE') }}</UiButton>
    </div>
    <div v-if="statusIn(['VALIDATED', 'CONFIRMATION_IN_PROGRESS', 'TO_BE_CONFIRMED'])">
      <UiButton variant="accent" block @click="updateStatus('CONFIRMED')">{{ $t('getsim.actions.CONFIRM') }}</UiButton>
    </div>
    <div v-if="statusIn(['NOT_VALIDATED'])">
      <UiButton variant="accent" block @click="updateStatus('CANCELED')">{{ $t('getsim.actions.CANCEL') }}</UiButton>
    </div>
    <div v-if="statusIn(['TERMINATED'])">
      <UiButton variant="accent" block>{{ $t('getsim.actions.SHOW_SIM') }}</UiButton>
    </div>

    <div v-if="statusIn(['CONFIRMED', 'TERMINATED'])">
      <UiButton variant="accent" block>{{ $t('getsim.actions.EXPORT') }}</UiButton>
    </div>
    <div v-if="statusIn(['VALIDATED', 'CONFIRMATION_IN_PROGRESS', 'TO_BE_CONFIRMED', 'CONFIRMED'])">
      <UiButton variant="accent" block>{{ $t('getsim.actions.DUPLICATE') }}</UiButton>
    </div>
    <div v-if="statusIn(['CONFIRMED'])">
      <UiButton variant="accent">{{ $t('getsim.actions.IMPORT_SIM') }}</UiButton>
    </div>

  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import { updateOrderStatus } from '@/api/orders';

export default {
  props: {
    order: Object,
  },
  components: {
    UiButton,
  },

  methods: {
    async updateStatus(newStatus) {
      const orderData = await updateOrderStatus(this.order.id, newStatus);
      this.order.status = orderData.status;
    },
    statusIn(statuses) {
      return statuses.find(s => s === this.order.status);
    },
  },
};
</script>

<style lang="scss" scoped>
.action-buttons {
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
  div {
    flex: 1;
    padding-left: 10px;
    padding-right: 10px;
  }
  button {
    padding: 0;
  }
}
</style>
