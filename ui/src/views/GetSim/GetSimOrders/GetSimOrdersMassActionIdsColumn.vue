<template>
  <div class="massactions-ids d-flex flex-wrap justify-content-start align-items-center truncate">
    <TruncateList :limit="2" :content="actionIds" @click="id => openActHistoryDetailsPanel(id)" > </TruncateList>
  </div>
</template>

<script>
import TruncateList from '@/components/ui/TruncateList';
import { mapState, mapMutations } from 'vuex';
import { searchMassActionsById } from '@/api/massActions';
import get from 'lodash.get';

export default {
  name: 'GetSimOrdersMassActionIdsColumn',
  components: {
    TruncateList,
  },
  props: {
    row: Object,
  },
  computed: {
    actionIds() {
      return this.row.massActionIds;
    },
    ...mapState({
      isOpen: state => state.ui.isPanelOpen,
    }),
  },
  methods: {
    ...mapMutations(['openPanel']),

    async openActHistoryDetailsPanel(id) {
      const massAction = await searchMassActionsById(id);
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
};
</script>

<style scoped>
.truncate {
  max-width: 10rem;
}
</style>
