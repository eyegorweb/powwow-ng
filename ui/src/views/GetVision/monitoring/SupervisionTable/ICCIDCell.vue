<template>
  <button class="btn btn-link p-0" @click.stop="openDetailPanel">
    {{ row.iccid }}
  </button>
</template>

<script>
import { mapMutations } from 'vuex';
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
      const lineId = get(this.row, 'msisdn');
      const openTrigger = () => {
        this.openPanel({
          title: this.$t('getparc.lineDetail.title', {
            lineId,
          }),
          panelId: 'getparc.actLines.details.title',
          payload: {
            meta: this.row,
            searchByIccid: true,
          },
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
};
</script>

<style lang="scss" scoped></style>
