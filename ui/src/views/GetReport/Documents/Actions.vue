<template>
  <ActionButtons :actions="actions" @itemClick="onActionClicked" />
</template>

<script>
import ActionButtons from '@/components/DataTable/ActionButtons.vue';
import { mapMutations } from 'vuex';
import { getBaseURL } from '@/utils.js';

export default {
  components: {
    ActionButtons,
  },
  props: {
    row: Object,
  },
  data() {
    return {
      actions: ['actions.DOWNLOAD', 'actions.DELETE'],
    };
  },

  methods: {
    ...mapMutations(['startDownload']),

    onActionClicked(action) {
      if (action === 'actions.DELETE') {
        this.$emit('deleteDocument');
        return;
      }

      if (action === 'actions.DOWNLOAD') {
        this.startDownload(`${getBaseURL()}/api/file/download/document/${this.row.id}`);
        return;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
