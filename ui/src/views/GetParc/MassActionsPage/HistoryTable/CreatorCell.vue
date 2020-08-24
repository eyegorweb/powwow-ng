<template>
  <button class="btn btn-link p-0" @click.stop="onClick">{{ row.creatorUsername }}</button>
</template>

<script>
import get from 'lodash.get';
import { mapState, mapMutations } from 'vuex';
import { setTimeout } from 'timers';

export default {
  name: 'CreatorCell',
  props: {
    row: {
      type: Object,
    },
  },
  methods: {
    ...mapMutations(['openPanel']),

    onClick() {
      const firstName = get(this.row, 'creatorFirstname');
      const lastName = get(this.row, 'creatorLastname');
      const openTrigger = () => {
        this.openPanel({
          title: this.$t('getsim.creator.title', { firstName, lastName }),
          panelId: 'getparc.creator.title',
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
