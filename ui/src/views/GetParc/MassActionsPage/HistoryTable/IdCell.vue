<template>
  <button class="btn btn-link p-0" @click.prevent="openActHistoryDetailsPanel">{{ row.id }}</button>
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

    openActHistoryDetailsPanel() {
      const type = get(this.row, 'type');
      const date = this.formattedDate(get(this.row, 'massAction.dueDate'));
      const openTrigger = () => {
        this.openPanel({
          title: this.$t('getparc.history.details.manageActTitle', {
            type,
            date,
          }),
          panelId: 'getparc.history.details.title',
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

    formattedDate(date) {
      const parts = date.split(' ');
      return parts[0];
    },
  },
  computed: mapState({
    isOpen: state => state.ui.isPanelOpen,
  }),
};
</script>
