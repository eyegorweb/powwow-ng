<template>
  <button class="btn btn-link p-0" @click.prevent="openOrderDetailsPanel">{{ row.id }}</button>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { setTimeout } from 'timers';

export default {
  props: {
    row: Object,
  },

  methods: {
    ...mapMutations(['openPanel']),

    openOrderDetailsPanel() {
      const openTrigger = () => {
        this.openPanel({
          title: this.$t('getsim.details.title', { id: this.row.id }),
          panelId: 'getsim.details.title',
          payload: this.row,
          wide: false,
          backdrop: false,
        });
      };

      /**
       * On veux attendre que le panel existant soit fermé avant de réouvrir un nouveau panel
       */
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
