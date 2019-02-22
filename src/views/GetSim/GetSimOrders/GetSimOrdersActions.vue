<template>
  <UiDropdownButton>
    <UiButton
      slot="trigger"
      slot-scope="{ staticClass, toggle }"
      variant="outline-secondary"
      class="flex-grow-1 py-1 px-1"
      @click.prevent="toggle"
      :class="staticClass"
    >{{ $t('getsim.actions.btn') }}</UiButton>
    <div slot-scope="{ hide }">
      <div class="list-group">
        <button
          type="button"
          class="list-group-item list-group-item-action order-action"
          :key="action"
          v-for="action in actions"
          @click="() => {hide(); onActionClicked(action)}"
        >{{ $t(action) }}</button>
      </div>
    </div>
  </UiDropdownButton>

</template>

<script>
import UiDropdownButton from '@/components/ui/UiDropdownButton';
import UiButton from '@/components/ui/Button';

export default {
  props: {
    order: Object,
  },
  components: {
    UiDropdownButton,
    UiButton,
  },
  methods: {
    onActionClicked(action) {
      console.log('Action = ', action);
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
          return ['getsim.actions.DETAIL', 'getsim.actions.DUPLICATE', 'getsim.actions.CANCEL'];

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
