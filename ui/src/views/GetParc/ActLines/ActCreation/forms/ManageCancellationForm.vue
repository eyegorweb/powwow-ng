<template>
  <ActFormContainer :validate-fn="onValidate" exclude-default-fields>
    <div class="form-container mb-3">
      <span class="font-weight-bold"
        >{{ $t('getparc.actCreation.ManageCancellation.choose') }}:</span
      >
      <UiCheckbox
        input-type="radio"
        value="range"
        v-model="FormatOfInput"
        shape="round"
        :filled="true"
        >{{ $t('getparc.actCreation.ManageCancellation.delay') }}</UiCheckbox
      >
      <UiCheckbox
        input-type="radio"
        value="date-picker"
        v-model="FormatOfInput"
        shape="round"
        :filled="true"
        >{{ $t('getparc.actCreation.ManageCancellation.date') }}</UiCheckbox
      >
    </div>
    <ManageCancellationFormDelay
      v-if="FormatOfInput === 'range'"
      @change:cancel="handleCancel"
      @change:validation="handleValidation"
    />
    <ManageCancellationFormDate
      v-else
      @change:cancel="handleCancel"
      @change:validation="handleValidation"
    />
    <Modal v-if="waitForConfirmation">
      <div slot="body">
        <div class="text-warning">
          {{ $t('getparc.actCreation.carouselItem.MODAL_WARNING') }}
        </div>
        <p>
          <span>{{ $t('getparc.actCreation.modal.modalPreventMsg') }}</span
          ><br />
          <span>{{ $t('getparc.actCreation.modal.modalConfirmMsg') }}</span>
        </p>
      </div>
      <div slot="footer" class="btn-wrapper">
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
  </ActFormContainer>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import UiCheckbox from '@/components/ui/Checkbox';
import ManageCancellationFormDelay from './ManageCancellationFormDelay';
import ManageCancellationFormDate from './ManageCancellationFormDate';
import ActFormContainer from './parts/ActFormContainer';
import { reactivateLines } from '@/api/actCreation';
import Modal from '@/components/Modal';

export default {
  components: {
    UiCheckbox,
    ManageCancellationFormDelay,
    ManageCancellationFormDate,
    ActFormContainer,
    Modal,
  },
  data() {
    return {
      FormatOfInput: 'range',
      waitForConfirmation: false,
    };
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
  },
  methods: {
    handleCancel() {
      this.waitForConfirmation = true;
    },
    handleValidation(options) {
      console.log('options', options);
      this.waitForConfirmation = true;
    },
    async onValidate(contextValues) {
      return await reactivateLines(this.appliedFilters, this.selectedLinesForActCreation, {
        suspendreFacturation: false,
        nonModifiableParClient: false,
        notifEmail: contextValues.notificationCheck,
        dueDate: contextValues.actDate,
        partyId: this.actCreationPrerequisites.partner.id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.form-container {
  display: flex;
  flex-flow: row wrap;
  align-items: center;

  /deep/ .checkbox-container label {
    margin-bottom: 0;
    margin-left: 20px;
  }
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
