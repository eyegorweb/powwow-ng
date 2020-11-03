<template>
  <Modal v-if="!!actionToConfirm">
    <div slot="body">
      <div class="text-danger">
        <i class="ic-Alert-Icon"></i>
        {{ $t(actionToConfirm.message) }}
      </div>
    </div>
    <div slot="footer">
      <button
        class="modal-default-button btn btn-danger btn-sm"
        v-if="!isLoading"
        @click.stop="closeAction()"
      >
        {{ $t('cancel') }}
      </button>
      <button
        class="modal-default-button btn btn-success btn-sm ml-1"
        v-if="!actionToConfirm.noOkButton && !isLoading"
        @click.stop="doRequest()"
      >
        {{ $t('save') }}
      </button>
      <button class="modal-default-button btn btn-light btn-sm ml-1" disabled v-if="isLoading">
        {{ $t('processing') }}...
        <CircleLoader />
      </button>
    </div>
  </Modal>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Modal from '@/components/Modal';
import CircleLoader from '@/components/ui/CircleLoader';

export default {
  components: {
    Modal,
    CircleLoader,
  },
  computed: mapState({
    actionToConfirm: state => state.ui.actionToConfirm,
  }),

  data() {
    return {
      isLoading: false,
    };
  },

  methods: {
    ...mapMutations(['closeAction']),
    async doRequest() {
      this.isLoading = true;
      await this.actionToConfirm.actionFn();
      this.isLoading = false;
      if (this.actionToConfirm.doAfterFn) {
        this.actionToConfirm.doAfterFn();
      }
      this.closeAction();
    },
  },
};
</script>

<style lang="scss" scoped></style>
