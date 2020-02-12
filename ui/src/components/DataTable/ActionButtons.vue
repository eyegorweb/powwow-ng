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
            @click.stop="
              () => {
                hide();
                $emit('itemClick', action);
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

export default {
  props: {
    actions: Array,
  },
  components: {
    UiDropdownButton,
    UiButton,
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
