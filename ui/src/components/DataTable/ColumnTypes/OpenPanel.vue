<template>
  <button class="btn btn-link p-0" @click.stop="triggerOpenPanel">
    <slot>
      {{ item }}
    </slot>
  </button>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'OpenPanel',
  props: {
    format: {
      type: Object,
      required: true,
    },
    item: {
      type: String,
    },
    row: {
      type: [Object, Array],
    },
  },

  methods: {
    ...mapMutations(['openPanel']),

    triggerOpenPanel() {
      if (!this.format.getConfig) return;

      const openTrigger = () => {
        this.openPanel(this.format.getConfig(this.row));
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
