<template>
  <div class="action-buttons">
    <div v-if="statusIn(['NOT_VALIDATED'])">
      <UiButton variant="accent" block @click="updateStatus('VALIDATED')">{{
        $t('getsim.actions.VALIDATE')
      }}</UiButton>
    </div>
    <div
      v-if="
        userIsBO && statusIn(['VALIDATED', 'CONFIRMATION_IN_PROGRESS', 'TO_BE_CONFIRMED_BY_BO'])
      "
    >
      <UiButton variant="accent" block @click="confirmOrder()">{{
        $t('getsim.actions.CONFIRM')
      }}</UiButton>
    </div>
    <div v-if="statusIn(['NOT_VALIDATED'])">
      <UiButton variant="accent" block @click="updateStatus('CANCELED')">{{
        $t('getsim.actions.CANCEL')
      }}</UiButton>
    </div>
    <div>
      <UiButton variant="accent" block :disabled="order.status !== 'TERMINATED'">{{
        $t('getsim.actions.EXPORT')
      }}</UiButton>
    </div>
    <div
      v-if="
        statusIn([
          'VALIDATED',
          'CONFIRMATION_IN_PROGRESS',
          'TO_BE_CONFIRMED',
          'TO_BE_CONFIRMED_BY_BO',
          'CONFIRMED',
        ])
      "
    >
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
import { mapGetters } from 'vuex';

export default {
  props: {
    order: Object,
  },
  components: {
    UiButton,
  },

  computed: {
    ...mapGetters(['userIsBO']),
  },

  methods: {
    ...mapMutations(['openPanel', 'closePanel']),
    ...mapMutations('getsim', ['refreshIndicators', 'updateOrderInTable']),

    async updateStatus(newStatus) {
      const orderData = await updateOrderStatus(this.order.id, newStatus);
      this.order.status = orderData.status;
      this.updateOrderInTable(orderData);
      this.refreshIndicators();
    },

    async confirmOrder() {
      switch (this.order.status) {
        case 'TO_BE_CONFIRMED_BY_BO': {
          const orderData = await updateOrderStatus(this.order.id, 'TO_BE_CONFIRMED');
          this.order.status = orderData.status;
          this.updateOrderInTable(orderData);
          break;
        }

        case 'CONFIRMATION_IN_PROGRESS':
        case 'VALIDATED': {
          const orderData = await updateOrderStatus(this.order.id, 'CONFIRMED');
          this.order.status = orderData.status;
          this.updateOrderInTable(orderData);
          break;
        }
      }
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
          ignoreClickAway: true,
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
