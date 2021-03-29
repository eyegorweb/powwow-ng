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

      <p>{{ message }}</p>

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
            <LoaderContainer :is-loading="isLoading">
              <div slot="on-loading">
                <ModalSkeleton :is-loading="isLoading" />
              </div>
              <div>
                {{ $t('getparc.actCreation.modal.modalConfirmRefuse') }}
              </div>
            </LoaderContainer>
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

    <div slot="messages" class="text-info">
      <div v-if="requestErrors && requestErrors.length">
        <h6 class="text-danger">{{ $t('errors.all') }}</h6>
        <ul class="text-danger list-unstyled">
          <li v-for="error in requestErrors" :key="error.message">{{ error.message }}</li>
        </ul>
      </div>
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
import { searchLineById } from '@/api/linesActions';

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
      singleLineFound: undefined,
      message: '',
      requestErrors: [],
    };
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters', 'linesActionsResponse']),
    partner() {
      if (this.actCreationPrerequisites.searchById) {
        if (this.singleLineFound) {
          return this.singleLineFound.party;
        }
      }
      return this.actCreationPrerequisites.partner;
    },
  },
  async mounted() {
    await this.loadSingleLineInfo();
  },
  methods: {
    ...mapMutations(['flashMessage']),
    async loadSingleLineInfo() {
      if (
        this.actCreationPrerequisites.searchById &&
        this.linesActionsResponse &&
        this.linesActionsResponse.total === 1
      ) {
        const lineInTable = this.linesActionsResponse.items[0];
        this.singleLineFound = await searchLineById(lineInTable.id);
      }
    },
    handleCancel(options) {
      this.validate = false;
      this.options = options;
      this.waitForConfirmation = true;
    },
    async handleValidation(options) {
      this.validate = true;
      this.options = options;
      this.waitForConfirmation = true;
    },
    async onValidate(contextValues) {
      if (this.checkErrors()) return;
      const response = await manageCancellation(
        this.appliedFilters,
        this.selectedLinesForActCreation,
        {
          dueDate: this.options.date ? this.options.date : '',
          partyId: this.partner.id,
          validate: this.validate,
          tempDataUuid: contextValues.tempDataUuid,
        }
      );
      if (response.errors && response.errors.length) {
        response.errors.forEach(r => {
          if (r.extensions && r.extensions.error && r.extensions.error === 'MassActionLimit') {
            const count = r.extensions.limit ? r.extensions.limit : '';
            const messageErrorMaxLine = this.$t(
              'getparc.actCreation.report.FILE_MAX_LINE_NUMBER_INVALID',
              {
                count,
              }
            );
            this.requestErrors = [
              {
                message: messageErrorMaxLine,
              },
            ];
          } else {
            this.requestErrors = [
              {
                message: r.message,
              },
            ];
          }
        });
        return { errors: response.errors };
      }
      if (response.validate > 1) {
        this.message = this.$t('ResfuseLinesError', { nb: response.validate });
      } else {
        this.message = this.$t('ResfuseLineError', { nb: response.validate });
      }
      return response;
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
