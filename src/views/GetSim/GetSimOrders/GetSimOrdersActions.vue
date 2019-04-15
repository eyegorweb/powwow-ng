<template>
  <div class="d-flex justify-content-end">
    <UiDropdownButton>
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
import { mapMutations } from 'vuex';

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

          break;
        }
      }
    },
  },
  computed: {
    actions() {
      switch (this.order.status) {
        case 'NOT_VALIDATED':
          return [
            'getsim.actions.DETAIL',
            'getsim.actions.DUPLICATE',
            'getsim.actions.CANCEL',
            'getsim.actions.VALIDATE',
          ];

        case 'VALIDATED':
          return ['getsim.actions.DETAIL', 'getsim.actions.DUPLICATE'];

        case 'CONFIRMATION_IN_PROGRESS':
        case 'TO_BE_CONFIRMED':
        case 'CANCELED':
          return ['getsim.actions.DETAIL', 'getsim.actions.DUPLICATE'];

        case 'CONFIRMED':
          return ['getsim.actions.DETAIL', 'getsim.actions.SHOW_SIM', 'getsim.actions.DUPLICATE'];

        case 'TERMINATED':
          return [
            'getsim.actions.DETAIL',
            'getsim.actions.EXPORT',
            'getsim.actions.SHOW_SIM',
            'getsim.actions.DUPLICATE',
          ];
        case 'TO_BE_CONFIRMED_BY_BO':
          return ['getsim.actions.DETAIL', 'getsim.actions.CONFIRM', 'getsim.actions.DUPLICATE'];
        default:
          return [];
      }
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
