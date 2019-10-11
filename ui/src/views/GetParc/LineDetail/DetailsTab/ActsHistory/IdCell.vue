<template>
  <button class="btn btn-link p-0" @click.prevent="openActHistoryDetailsPanel">
    {{ row.massActionId }}
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
      const massAction = await searchMassActionsById(this.row.massActionId);
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
          payload: massAction,
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
