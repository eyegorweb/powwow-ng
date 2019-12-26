<template>
  <button class="btn btn-link p-0" @click.stop="openDetailPanel">
    {{ row.id }}
  </button>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'AlarmIdCell',
  props: {
    row: Object,
    title: String,
  },

  methods: {
    ...mapMutations(['openPanel']),

    openDetailPanel() {
      const openTrigger = () => {
        this.openPanel({
          title: this.$t(this.title),
          panelId: this.title,
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

<style lang="scss" scoped></style>
