<template>
  <ActionButtons :actions="actions" @itemClick="onActionClicked" />
</template>

<script>
import ActionButtons from '@/components/DataTable/ActionButtons.vue';
import { enableReport, disableReport } from '@/api/reports';
import { mapMutations } from 'vuex';

export default {
  components: {
    ActionButtons,
  },
  props: {
    report: Object,
  },

  data() {
    return {
      canDoAsyncAction: true,
    };
  },

  computed: {
    actions() {
      const actions = [];

      if (this.report.disabled) {
        actions.push('actions.ENABLE');
      } else {
        actions.push('actions.DISABLE');
      }

      return actions;
    },
  },

  methods: {
    ...mapMutations(['flashMessage']),

    async onActionClicked(action) {
      if (!this.canDoAsyncAction) return;

      const showMessage = ret => {
        if (ret) {
          this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
        } else {
          this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
        }

        this.$emit('actionIsDone');
      };

      let response;

      if (action === 'actions.ENABLE') {
        this.canDoAsyncAction = false;
        response = await enableReport(this.report.id);
        this.canDoAsyncAction = true;
      }
      if (action === 'actions.DISABLE') {
        this.canDoAsyncAction = false;
        response = await disableReport(this.report.id);
        this.canDoAsyncAction = true;
      }

      showMessage(response);
    },
  },
};
</script>

<style lang="scss" scoped></style>
