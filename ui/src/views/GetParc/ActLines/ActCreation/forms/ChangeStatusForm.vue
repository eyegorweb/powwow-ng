<template>
  <div v-if="partner">
    <ActFormContainer :validate-fn="onValidate" no-modal>
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
          </div>
          <div slot="footer" class="btn-wrapper">
            <div v-if="haveError" class="loader" :class="{ error: haveError }">
              {{ $t('retry') }}
            </div>
            <button
              class="modal-default-button btn btn--cancel"
              @click.stop="waitForConfirmation = false"
              :disabled="isLoading"
            >
              {{ $t('cancel') }}
            </button>
            <button
              class="modal-default-button btn ml-1 btn--confirm"
              @click.stop="confirmValdation(containerValidationFn)"
              :disabled="isLoading"
            >
              {{ $t('confirm') }}
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
  </div>
  <div v-else>{{ $t('noResult') }}</div>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import { mapState, mapGetters } from 'vuex';
import { terminateLines } from '@/api/actCreation';
import Modal from '@/components/Modal';
import LoaderContainer from '@/components/LoaderContainer';
import ModalSkeleton from '@/components/ui/skeletons/ModalSkeleton';
import { searchLineById } from '@/api/linesActions';
import { formatBackErrors } from '@/utils/errors';

export default {
  components: {
    ActFormContainer,
    Modal,
    LoaderContainer,
    ModalSkeleton,
  },
  data() {
    return {
      notEditable: false,
      suspendBilling: false,
      canValidate: true,
      waitForConfirmation: false,
      isLoading: false,
      haveError: false,
      singleLineFound: undefined,
      exceptionError: undefined,
    };
  },
  async mounted() {
    await this.loadSingleLineInfo();
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
    async onValidate(contextValues) {
      const response = await terminateLines(this.appliedFilters, this.selectedLinesForActCreation, {
        suspendreFacturation: this.suspendBilling,
        nonModifiableParClient: this.notEditable,
        notifEmail: contextValues.notificationCheck,
        dueDate: contextValues.actDate,
        partyId: this.partner.id,
        tempDataUuid: contextValues.tempDataUuid,
      });
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
      return response;
    },
    chekdate(value) {
      value ? (this.canValidate = true) : (this.canValidate = false);
    },
    async confirmValdation(containerValidationFn) {
      try {
        this.isLoading = true;
        const response = await containerValidationFn();
        this.isLoading = false;
        this.waitForConfirmation = false;
        return response;
      } catch (err) {
        this.haveError = true;
        this.isLoading = false;
      }
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

::v-deep .btn-primary {
  background-color: $orange;
  border: none;
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
