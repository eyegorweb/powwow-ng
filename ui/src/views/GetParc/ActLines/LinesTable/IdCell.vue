<template>
  <button class="btn btn-link btn-select p-0" @click.stop="openDetailPanel">{{ row.iccid }}</button>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { setTimeout } from 'timers';
import get from 'lodash.get';

export default {
  name: 'IdCell',
  props: {
    row: Object,
  },

  methods: {
    ...mapMutations(['openPanel']),

    openDetailPanel() {
      const msisdn = get(this.row, 'accessPoint.lines[0].msisdn');
      const openTrigger = () => {
        this.openPanel({
          title: this.$t('getparc.lineDetail.title', {
            msisdn,
          }),
          panelId: 'getparc.actLines.details.title',
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

<style lang="scss" scoped>
.btn-select {
  user-select: initial;
}
</style>
