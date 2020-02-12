<template>
  <button class="btn btn-link p-0" @click.stop="onClick">
    {{ row.auditable.creator.name.firstName }} {{ row.auditable.creator.name.lastName }}
  </button>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { setTimeout } from 'timers';

export default {
  name: 'GetSimOrdersCreatorCell',
  props: {
    row: {
      type: Object,
    },
  },
  methods: {
    ...mapMutations(['openPanel']),

    onClick() {
      const openTrigger = () => {
        this.openPanel({
          title: this.$t('getsim.creator.title', this.row.auditable.creator.name),
          panelId: 'getsim.creator.title',
          payload: this.row,
          wide: false,
        });
      };
      if (this.isOpen) {
        setTimeout(openTrigger, 500);
      } else {
        openTrigger();
      }
    },
  },
  computed: mapState({
    isOpen: state => state.ui.isPanelOpen,
  }),
};
</script>

<style scoped></style>
