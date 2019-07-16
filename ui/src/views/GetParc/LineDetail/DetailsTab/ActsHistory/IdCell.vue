<template>
  <button class="btn btn-link p-0" @click.prevent="openActHistoryDetailsPanel">
    {{ row.massActionId }}
  </button>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
// import { setTimeout } from 'timers';

export default {
  name: 'IdCell',
  props: {
    row: Object,
  },

  methods: {
    ...mapMutations(['openPanel']),

    openActHistoryDetailsPanel() {
      console.log('openPanel');
      // attente api
      // const openTrigger = () => {
      //   this.openPanel({
      //     title: this.$t('getparc.history.details.title', { id: this.row.id }),
      //     panelId: 'getparc.history.details.title',
      //     payload: this.row,
      //     wide: false,
      //     backdrop: false,
      //   });
      // };

      /**
       * On veux attendre que le panel existant soit fermé avant de réouvrir un nouveau panel
       */
      // if (this.isOpen) {
      //   setTimeout(openTrigger, 500);
      // } else {
      //   openTrigger();
      // }
    },
  },
  computed: mapState({
    isOpen: state => state.ui.isPanelOpen,
  }),
};
</script>
