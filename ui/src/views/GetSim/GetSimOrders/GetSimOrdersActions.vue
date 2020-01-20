<template>
  <ActionButtons :actions="actions" @itemClick="onActionClicked" />
</template>

<script>
import ActionButtons from '@/components/DataTable/ActionButtons.vue';
import { cancelOrder, updateOrderStatus } from '@/api/orders';
import { mapMutations, mapGetters } from 'vuex';

export default {
  props: {
    order: Object,
  },
  components: {
    ActionButtons,
  },
  methods: {
    ...mapMutations(['openPanel']),
    ...mapMutations('getsim', ['refreshIndicators']),
    async onActionClicked(action) {
      switch (action) {
        case 'getsim.actions.CANCEL': {
          const orderData = await cancelOrder(this.order.id);
          this.order.status = orderData.status;
          break;
        }
        case 'getsim.actions.DUPLICATE': {
          this.openPanel({
            title: this.$t('getsim.order-sim'),
            panelId: 'getsim.order-sim',
            wide: true,
            backdrop: true,
            payload: this.order,
            ignoreClickAway: true,
          });
          break;
        }
        case 'getsim.actions.DETAIL': {
          this.openPanel({
            title: this.$t('getsim.details.title', { id: this.order.id }),
            panelId: 'getsim.details.title',
            payload: this.order,
            wide: false,
            backdrop: false,
          });
          break;
        }
        case 'getsim.actions.CONFIRM': {
          if (this.order.status === 'TO_BE_CONFIRMED_BY_BO') {
            const orderData = await updateOrderStatus(this.order.id, 'TO_BE_CONFIRMED');
            this.order.status = orderData.status;
          }

          if (this.order.status === 'CONFIRMATION_IN_PROGRESS') {
            const orderData = await updateOrderStatus(this.order.id, 'CONFIRMED');
            this.order.status = orderData.status;
          }
          break;
        }
        case 'getsim.actions.EXPORT': {
          // TODO
          console.log('TODO export lines');
          break;
        }
        case 'getsim.actions.SHOW_SIM': {
          // TODO
          console.log(' TODO show lines');
          break;
        }
        case 'getsim.actions.VALIDATE': {
          const orderData = await updateOrderStatus(this.order.id, 'VALIDATED');
          this.order.status = orderData.status;
          this.refreshIndicators();
          break;
        }
      }
    },
  },
  computed: {
    ...mapGetters(['userIsBO']),
    actions() {
      let actions = [];
      switch (this.order.status) {
        case 'NOT_VALIDATED': {
          actions = [
            'getsim.actions.DETAIL',
            'getsim.actions.DUPLICATE',
            'getsim.actions.CANCEL',
            'getsim.actions.VALIDATE',
          ];
          break;
        }

        case 'VALIDATED':
          actions = ['getsim.actions.DETAIL', 'getsim.actions.DUPLICATE'];
          break;

        case 'CONFIRMATION_IN_PROGRESS':
        case 'TO_BE_CONFIRMED':
        case 'CANCELED': {
          actions = ['getsim.actions.DETAIL', 'getsim.actions.DUPLICATE'];
          break;
        }

        case 'CONFIRMED': {
          actions = [
            'getsim.actions.DETAIL',
            'getsim.actions.SHOW_SIM',
            'getsim.actions.DUPLICATE',
          ];
          break;
        }

        case 'TERMINATED': {
          actions = [
            'getsim.actions.DETAIL',
            'getsim.actions.EXPORT',
            'getsim.actions.SHOW_SIM',
            'getsim.actions.DUPLICATE',
          ];
          break;
        }

        case 'TO_BE_CONFIRMED_BY_BO': {
          actions = ['getsim.actions.DETAIL', 'getsim.actions.DUPLICATE'];
          break;
        }

        default:
          actions = [];
      }

      if (this.userIsBO) {
        const statusesForConfirmation = [
          'VALIDATED',
          'CONFIRMATION_IN_PROGRESS',
          'TO_BE_CONFIRMED_BY_BO',
        ];

        if (statusesForConfirmation.find(s => s === this.order.status)) {
          actions.push('getsim.actions.CONFIRM');
        }
      }
      return actions;
    },
  },
};
</script>
