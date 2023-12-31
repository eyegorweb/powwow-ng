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
                <span>{{ dueDate }} </span>
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
        <div slot="footer" class="btnsContainer">
          <button
            class="btns btns--cancel"
            @click.stop="waitForConfirmation = false"
            :disabled="isLoading"
          >
            {{ $t('cancel') }}
          </button>
          <button
            class="btns btns--confirm"
            @click.stop="confirmValdation(containerValidationFn)"
            :disabled="isLoading"
          >
            {{ $t('save') }}
          </button>
        </div>
      </Modal>
    </div>

    <div slot="messages" class="text-info">
      <div v-if="exceptionError">
        <h6 class="text-danger">{{ $t('errors.all') }}</h6>
        <div class="text-danger">
          {{ exceptionError }}
        </div>
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
import { formatBackErrors } from '@/utils/errors';

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
      exceptionError: undefined,
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
    dueDate() {
      const date = this.options && this.options.date ? this.options.date.split(' ') : '';
      const selectedDelay =
        this.options && this.options.selectedDelay ? this.options.selectedDelay : 0;
      if (this.FormatOfInput === 'range') {
        if (selectedDelay) {
          return `${this.$t('getparc.actCreation.modal.modalPreventMsgDelay', {
            delay: selectedDelay,
          })} : ${date[0]}`;
        } else {
          return this.$t('getparc.actCreation.modal.modalPreventMsg');
        }
      } else {
        return `${this.$t('getparc.actCreation.modal.modalPreventMsgSelectedDate', {
          date: date[0],
        })}`;
      }
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
        let errorMessage = '',
          massActionLimitError = '',
          count;
        const formatted = formatBackErrors(response.errors)
          .map((e) => e.errors)
          .flat();
        formatted.forEach((e) => {
          if (e.key === 'limit') {
            count = e.value;
          }
          if (e.key === 'error') {
            massActionLimitError = `${e.key}.${e.value}`;
          } else {
            errorMessage = `${e.key}: ${e.value}`;
          }
        });
        if (massActionLimitError) {
          this.exceptionError = `${this.$t(
            'getparc.actCreation.report.errors.' + massActionLimitError,
            {
              count,
            }
          )}`;
        } else {
          this.exceptionError = errorMessage;
        }

        return {
          errors: response.errors,
          validationError: {
            validated: response.validated,
            tempDataUuid: response.tempDataUuid,
          },
        };
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

  ::v-deep .checkbox-container label {
    margin-bottom: 0;
    margin-left: 20px;
  }
}

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
