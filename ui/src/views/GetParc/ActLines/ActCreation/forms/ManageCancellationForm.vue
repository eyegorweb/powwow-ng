<template>
  <ActFormContainer :validate-fn="onValidate" exclude-default-fields no-modal>
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

    <div slot="validate-btn-content" slot-scope="{ containerValidationFn }">
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
          <template v-if="validate">
            <LoaderContainer :is-loading="isLoading">
              <div slot="on-loading">
                <ModalSkeleton :is-loading="isLoading" />
              </div>
              <div class="text-warning">
                {{ $t('getparc.actCreation.carouselItem.MODAL_WARNING') }}
              </div>
              <p>
                <span>{{ $t('getparc.actCreation.modal.modalPreventMsg') }}</span>
                <br />
                <span>{{ $t('getparc.actCreation.modal.modalConfirmMsg') }}</span>
              </p>
            </LoaderContainer>
          </template>
          <p v-else>
            <span>{{ $t('getparc.actCreation.modal.modalConfirmRefuse') }}</span>
          </p>
        </div>
        <div slot="footer">
          <button
            class="modal-default-button btn btn-danger btn-sm"
            @click.stop="waitForConfirmation = false"
            :disabled="isLoading"
          >
            {{ $t('cancel') }}
          </button>
          <button
            class="modal-default-button btn btn-success btn-sm ml-1"
            @click.stop="confirmValdation(containerValidationFn)"
            :disabled="isLoading"
          >
            {{ $t('save') }}
          </button>
        </div>
      </Modal>
    </div>
  </ActFormContainer>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import UiCheckbox from '@/components/ui/Checkbox';
import ManageCancellationFormDelay from './ManageCancellationFormDelay';
import ManageCancellationFormDate from './ManageCancellationFormDate';
import ActFormContainer from './parts/ActFormContainer2';
import { manageCancellation } from '@/api/actCreation';
import Modal from '@/components/Modal';
import LoaderContainer from '@/components/LoaderContainer';
import ModalSkeleton from '@/components/ui/skeletons/ModalSkeleton';

export default {
  components: {
    UiCheckbox,
    ManageCancellationFormDelay,
    ManageCancellationFormDate,
    ActFormContainer,
    Modal,
    LoaderContainer,
    ModalSkeleton,
  },
  data() {
    return {
      FormatOfInput: 'range',
      waitForConfirmation: false,
      errors: {},
      options: undefined,
      validate: undefined,
      isLoading: false,
    };
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
  },
  methods: {
    ...mapMutations(['flashMessage']),
    handleCancel(options) {
      this.validate = false;
      this.options = options;
      this.waitForConfirmation = true;
    },
    handleValidation(options) {
      this.validate = true;
      this.options = options;
      this.waitForConfirmation = true;
    },
    async onValidate(contextValues) {
      if (this.checkErrors()) return;
      return await manageCancellation(this.appliedFilters, this.selectedLinesForActCreation, {
        dueDate: this.options.date ? this.options.date : '',
        partyId: this.actCreationPrerequisites.partner.id,
        validate: this.validate,
        tempDataUuid: contextValues.tempDataUuid,
      });
    },
    async confirmValdation(containerValidationFn) {
      try {
        this.isLoading = true;
        const response = await containerValidationFn();
        this.isLoading = false;
        this.waitForConfirmation = false;
        return response;
      } catch (err) {
        this.isLoading = false;
      }
    },
    checkErrors() {
      // if (!this.selectedShortCode) {
      //   this.errors.shortCode = 'errors.mandatory';
      //   return true;
      // }
      return false;
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
