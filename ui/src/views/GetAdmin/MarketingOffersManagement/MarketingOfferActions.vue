<template>
  <ActionButtons :actions="actions" @itemClick="onActionClicked" />
</template>

<script>
import ActionButtons from '@/components/DataTable/ActionButtons.vue';
import { enableMarketingOffer, disableMarketingOffer } from '@/api/marketingOffer';
import { mapMutations, mapGetters } from 'vuex';

export default {
  components: {
    ActionButtons,
  },
  props: {
    marketingOffer: Object,
  },
  data() {
    return {
      canDoAsyncAction: true,
    };
  },

  computed: {
    ...mapGetters(['userInfos', 'havePermission']),
    actions() {
      let additionalActions = [];

      if (this.marketingOffer.disabled) {
        additionalActions.push('actions.ENABLE');
      } else {
        additionalActions.push('actions.DISABLE');
      }

      if (this.havePermission('user', 'create')) {
        additionalActions.push('actions.DUPLICATE', 'actions.MODIFY');
      }

      return [...additionalActions];
    },
  },

  methods: {
    ...mapMutations(['flashMessage']),

    async onActionClicked(action) {
      const showMessage = (response) => {
        if (response && response.errors && response.errors.length) {
          // this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
          response.errors.forEach((e) => {
            this.flashMessage({ level: 'danger', message: e.message });
          });
        } else {
          this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
        }
        this.$emit('actionIsDone');
      };

      if (action === 'actions.DUPLICATE') {
        this.$emit('duplicateMarketingOffer');
        return;
      }

      if (!this.canDoAsyncAction) return;

      let response;

      if (action === 'actions.ENABLE') {
        this.canDoAsyncAction = false;
        response = await enableMarketingOffer(this.marketingOffer.id);
        this.canDoAsyncAction = true;
      }

      if (action === 'actions.DISABLE') {
        this.canDoAsyncAction = false;
        response = await disableMarketingOffer(this.marketingOffer.id);
        this.canDoAsyncAction = true;
      }

      if (action === 'actions.MODIFY') {
        this.$emit('modifyMarketingOffer');
        return;
      }

      showMessage(response);
    },
  },
};
</script>

<style lang="scss" scoped></style>
