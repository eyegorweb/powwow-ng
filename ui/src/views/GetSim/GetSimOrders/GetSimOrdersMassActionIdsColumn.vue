<template>
  <div class="massactions-ids d-flex flex-wrap justify-content-start align-items-center truncate">
    <TruncateList :limit="2" :content="actionIds" @click="id => openActHistoryDetailsPanel(id)" > </TruncateList>
  </div>
</template>

<script>
import TruncateList from '@/components/ui/TruncateList';
import { mapState, mapMutations } from 'vuex';
import { searchMassActionsById } from '@/api/massActions';

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

      const openTrigger = () => {
        this.openPanel({
          title: this.$t('getparc.history.details.title'),
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
  },
};
</script>

<style scoped>
.truncate {
  max-width: 10rem;
}
</style>
