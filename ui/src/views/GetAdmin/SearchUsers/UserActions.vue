<template>
  <ActionButtons :actions="actions" @itemClick="onActionClicked" />
</template>

<script>
import ActionButtons from '@/components/DataTable/ActionButtons.vue';
import { enableUser, disableUser } from '@/api/users';
import { mapMutations } from 'vuex';

export default {
  components: {
    ActionButtons,
  },
  props: {
    user: Object,
  },
  data() {
    return {
      canDoAsyncAction: true,
    };
  },

  computed: {
    actions() {
      let additionalActions = [];

      if (this.user.disabled) {
        additionalActions.push('actions.ENABLE');
      } else {
        additionalActions.push('actions.DISABLE');
      }

      return [...additionalActions, 'actions.MODIFY'];
    },
  },

  methods: {
    ...mapMutations(['flashMessage']),

    async onActionClicked(action) {
      const showMessage = response => {
        if (response && response.errors && response.errors.length) {
          // this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
          response.errors.forEach(e => {
            this.flashMessage({ level: 'danger', message: e.message });
          });
        } else {
          this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
        }
        this.$emit('actionIsDone');
      };

      if (action === 'actions.DUPLICATE') {
        this.$emit('duplicateUser');
        return;
      }

      if (!this.canDoAsyncAction) return;

      let response;

      if (action === 'actions.ENABLE') {
        this.canDoAsyncAction = false;
        response = await enableUser(this.user.id);
        this.canDoAsyncAction = true;
      }

      if (action === 'actions.DISABLE') {
        this.canDoAsyncAction = false;
        response = await disableUser(this.user.id);
        this.canDoAsyncAction = true;
      }

      if (action === 'actions.MODIFY') {
        this.$emit('modifyUser');
        return;
      }

      showMessage(response);
    },
  },
};
</script>

<style lang="scss" scoped></style>
