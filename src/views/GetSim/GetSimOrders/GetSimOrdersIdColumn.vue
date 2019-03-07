<template>
  <a href="#" @click.prevent="onClick()">{{ row.id }}</a>
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

    onClick() {
      const openTrigger = () => {
        this.openPanel({
          title: this.$t('getsim.details.title', { id: this.row.id }),
          panelId: 'getsim.details.title',
          payload: this.row,
          wide: false,
          backdrop: false,
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
