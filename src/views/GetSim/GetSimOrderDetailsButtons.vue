<template>
  <div class="action-buttons">
    <div v-if="statusIn(['NOT_VALIDATED'])">
      <UiButton variant="accent" block @click="updateStatus('VALIDATED')">{{
        $t('getsim.actions.VALIDATE')
      }}</UiButton>
    </div>
    <div v-if="statusIn(['VALIDATED', 'CONFIRMATION_IN_PROGRESS', 'TO_BE_CONFIRMED'])">
      <UiButton variant="accent" block @click="updateStatus('CONFIRMED')">{{
        $t('getsim.actions.CONFIRM')
      }}</UiButton>
    </div>
    <div v-if="statusIn(['NOT_VALIDATED'])">
      <UiButton variant="accent" block @click="updateStatus('CANCELED')">{{
        $t('getsim.actions.CANCEL')
      }}</UiButton>
    </div>
    <div v-if="statusIn(['CONFIRMED', 'TERMINATED'])">
      <UiButton variant="accent" block>{{ $t('getsim.actions.EXPORT') }}</UiButton>
    </div>
    <div v-if="statusIn(['VALIDATED', 'CONFIRMATION_IN_PROGRESS', 'TO_BE_CONFIRMED', 'CONFIRMED'])">
      <UiButton variant="accent" block @click="openOrderPanel">{{
        $t('getsim.actions.DUPLICATE')
      }}</UiButton>
    </div>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import { updateOrderStatus } from '@/api/orders';
import { mapMutations } from 'vuex';
import { setTimeout } from 'timers';

export default {
  props: {
    order: Object,
  },
  components: {
    UiButton,
  },

  methods: {
    ...mapMutations(['openPanel', 'closePanel']),

    async updateStatus(newStatus) {
      const orderData = await updateOrderStatus(this.order.id, newStatus);
      this.order.status = orderData.status;
    },
    statusIn(statuses) {
      return statuses.find(s => s === this.order.status);
    },
    openOrderPanel() {
      this.closePanel();
      const title = this.$t('getsim.order-sim');
      const openTrigger = () => {
        this.openPanel({
          title,
          panelId: 'getsim.order-sim',
          wide: true,
          backdrop: true,
          payload: this.order,
        });
      };
      setTimeout(() => {
        openTrigger();
      }, 500);
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
