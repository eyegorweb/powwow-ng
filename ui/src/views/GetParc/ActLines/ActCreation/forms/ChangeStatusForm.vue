<template>
  <ActFormContainer :validate-fn="onValidate" @update:date="chekdate" no-modal>
    <div slot="validate-btn-content" slot-scope="{ containerValidationFn }">
      <button
        @click="waitForConfirmation = true"
        class="btn pl-4 pr-4 pt-2 pb-2"
        :class="{ disabled: !canValidate }"
      >
        <i :class="[canValidate ? 'ic-Minus-Icon' : 'ic-Check-Icon']" />
        {{ $t('getparc.actCreation.changeStatus.changeCardsStatus') }}
      </button>
      <div class="info">{{ info }}</div>
      <Modal v-if="waitForConfirmation">
        <div slot="body">
          <div class="loader" v-if="showLoader">
            <div class="skeleton-line"></div>
          </div>
          <div class="text-warning">{{ $t('getparc.actCreation.carouselItem.MODAL_WARNING') }}</div>
          <p>
            <span>{{ $t('getparc.actCreation.modal.modalPreventMsg') }}</span>
            <br />
            <span>{{ $t('getparc.actCreation.modal.modalConfirmMsg') }}</span>
          </p>
        </div>
        <div slot="footer" class="btn-wrapper">
          <div v-if="haveError" class="loader" :class="{ error: haveError }">
            {{ $t('retry') }}
          </div>
          <button
            class="modal-default-button btn btn--cancel"
            @click.stop="waitForConfirmation = false"
          >
            {{ $t('cancel') }}
          </button>
          <button
            class="modal-default-button btn ml-1 btn--confirm"
            @click.stop="confirmValdation(containerValidationFn)"
          >
            {{ $t('confirm') }}
          </button>
        </div>
      </Modal>
    </div>
    <div slot="messages" class="text-warning">
      <span>
        <i class="ic-Alert-Icon" />
        {{ $t('getparc.actCreation.changeStatus.warningMsg') }}
      </span>
    </div>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import { mapState, mapGetters } from 'vuex';
import { terminateLines } from '@/api/actCreation';
import Modal from '@/components/Modal';

export default {
  components: {
    ActFormContainer,
    Modal,
  },
  data() {
    return {
      notEditable: false,
      suspendBilling: false,
      canValidate: true,
      waitForConfirmation: false,
      showLoader: false,
      haveError: false,
    };
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
    total() {
      return this.selectedLinesForActCreation.length > 0
        ? this.selectedLinesForActCreation.length
        : 0;
    },
    info() {
      return this.total > 0
        ? `${this.$t('getparc.actCreation.SELECTED_LINES', { total: this.total })}`
        : '';
    },
  },
  methods: {
    async onValidate(contextValues) {
      return await terminateLines(this.appliedFilters, this.selectedLinesForActCreation, {
        suspendreFacturation: this.suspendBilling,
        nonModifiableParClient: this.notEditable,
        notifEmail: contextValues.notificationCheck,
        dueDate: contextValues.actDate,
        partyId: this.actCreationPrerequisites.partner.id,
        tempDataUuid: contextValues.tempDataUuid,
      });
    },
    chekdate(value) {
      value ? (this.canValidate = true) : (this.canValidate = false);
    },
    async confirmValdation(containerValidationFn) {
      try {
        this.showLoader = true;
        const response = await containerValidationFn();
        this.showLoader = false;
        this.waitForConfirmation = false;
        return response;
      } catch (err) {
        this.haveError = true;
        this.showLoader = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .btn-primary {
  background-color: $orange;
  border: none;
}

.loader {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.skeleton-line {
  width: 100px;
  height: 10px;
}

.btn {
  background-color: $orange;
  color: white;

  &.disabled {
    opacity: 1;
    pointer-events: none;
    background-color: $medium-gray;
  }
}

.info {
  color: $orange;
}

.btn-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .btn {
    width: calc(50% - 15px);
    border: 1px solid $primary;

    &--cancel {
      background-color: $white;
      color: $primary;
    }

    &--confirm {
      background-color: $primary;
      color: $white;
    }
  }
}
</style>
