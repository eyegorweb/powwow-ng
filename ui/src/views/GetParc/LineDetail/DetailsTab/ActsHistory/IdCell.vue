<template>
  <button
    class="btn btn-link p-0 user-select-text id-cell"
    @click.stop="openActHistoryDetailsPanel"
  >
    {{ row.massActionId || row.id }}
  </button>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { setTimeout } from 'timers';
import get from 'lodash.get';
import { searchMassActionsById } from '@/api/massActions';

export default {
  name: 'IdCell',
  props: {
    row: Object,
  },

  methods: {
    ...mapMutations(['openPanel']),

    async openActHistoryDetailsPanel() {
      const massAction = await searchMassActionsById(this.row.massActionId || this.row.id);
      if (!massAction) return;
      const type = get(massAction, 'type');
      const date = this.formattedDate(get(massAction, 'massAction.dueDate'));
      const openTrigger = () => {
        this.openPanel({
          title: this.$t('getparc.history.details.manageActTitle', {
            type,
            date,
          }),
          panelId: 'getparc.history.details.title',
          payload: { ...massAction, id: '' + (this.row.massActionId || this.row.id) },
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
    isOpen: (state) => state.ui.isPanelOpen,
  }),
};
</script>
