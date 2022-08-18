<template>
  <Modal v-if="!!actionToConfirm">
    <div slot="body">
      <div class="alert alert-warning" v-if="actionToConfirm.isWarning">
        {{ actionMessage }}
      </div>
      <div v-else-if="actionToConfirm.noStyle">
        {{ actionMessage }}
      </div>
      <div v-else-if="actionToConfirm.listStyle">
        <div v-html="actionMessage"></div>
      </div>
      <div v-else class="text-danger">
        <i class="ic-Alert-Icon"></i>
        <span v-html="actionMessage"></span>
      </div>
    </div>
    <div slot="footer" class="btnsContainer">
      <button class="btns btns--cancel" v-if="!isLoading" @click.stop="closeAction()">
        <template v-if="actionToConfirm.customCloseLabel">
          {{ $t(actionToConfirm.customCloseLabel) }}
        </template>
        <template v-else>
          {{ $t('cancel') }}
        </template>
      </button>
      <button
        class="btns btns--confirm"
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
    actionToConfirm: (state) => state.ui.actionToConfirm,
    actionMessage() {
      if (this.actionToConfirm) {
        if (this.actionToConfirm.noTranslation) {
          return this.actionToConfirm.message;
        }
        return this.$t(this.actionToConfirm.message);
      }

      return '';
    },
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

<style lang="scss" scoped>
.btnsContainer {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.btns {
  border: none;
  width: 48%;
  border-radius: 5px;
  padding: 10px;
  transition: 0.3s;

  &--confirm {
    background-color: #0055a4;
    color: white;

    &:hover {
      background-color: #00417e;
    }
  }

  &--cancel {
    border: 1px solid #0055a4;
    color: #0055a4;
    background-color: white;
  }
}
</style>
