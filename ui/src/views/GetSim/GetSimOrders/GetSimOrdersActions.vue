<template>
  <div class="d-flex justify-content-end">
    <UiDropdownButton :menu-style="{ left: '-4rem' }">
      <UiButton
        slot="trigger"
        slot-scope="{ staticClass, toggle }"
        variant="link"
        class="flex-grow-1 py-1 px-1"
        @click.prevent="toggle"
        :class="staticClass"
        >{{ $t('getsim.actions.btn') }}</UiButton
      >
      <div slot-scope="{ hide }">
        <div class="list-group">
          <button
            type="button"
            class="list-group-item list-group-item-action order-action hover-pointer"
            :key="action"
            v-for="action in actions"
            @click="
              () => {
                hide();
                onActionClicked(action);
              }
            "
          >
            {{ $t(action) }}
          </button>
        </div>
      </div>
    </UiDropdownButton>
  </div>
</template>

<script>
import UiDropdownButton from '@/components/ui/UiDropdownButton';
import UiButton from '@/components/ui/Button';
import { cancelOrder, updateOrderStatus } from '@/api/orders';
import { mapMutations, mapGetters } from 'vuex';

export default {
  props: {
    order: Object,
  },
  components: {
    UiDropdownButton,
    UiButton,
  },
  methods: {
    ...mapMutations(['openPanel']),
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

<style lang="scss" scoped>
.group-actions {
  .dropdown-menu {
    padding: 0;
  }
}

.order-action {
  font-size: 0.9rem;
}
</style>
