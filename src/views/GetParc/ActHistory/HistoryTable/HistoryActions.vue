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

export default {
  components: {
    UiDropdownButton,
    UiButton,
  },
  props: {
    item: Object,
  },
  data() {
    return {
      actions: ['getsim.actions.DETAIL'],
    };
  },
  methods: {
    async onActionClicked(action) {
      switch (action) {
        case 'getsim.actions.DETAIL': {
          this.$router.push({ name: 'actDetail', params: { massActionId: this.item.id } });
        }
      }
    },
  },
};
</script>

<style scoped></style>
