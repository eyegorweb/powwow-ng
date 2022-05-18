<template>
  <ActFormContainer :validate-fn="onValidate" no-modal>
    <div v-if="!useFileImportAsInput">
      <PartnerFields
        :custom-fields="allCustomFields"
        :specific-fields="allSpecificFields"
        :get-selected-value="getSelectedValue"
        :errors="customFieldsErrors"
        @change="onValueChanged"
        show-optional-field
      />
    </div>
    <div slot="validate-btn-content" slot-scope="{ containerValidationFn }">
      <button
        @click="waitForConfirmation = true"
        :disabled="canDisableSave"
        class="btn btn-primary pl-4 pr-4 pt-2 pb-2"
      >
        <i class="ic-Edit-Icon" />
        {{ $t('getparc.actCreation.editCustomFields.validateBtn') }}
      </button>
      <Modal v-if="waitForConfirmation">
        <div slot="body">
          <LoaderContainer :is-loading="isLoading">
            <div slot="on-loading">
              <ModalSkeleton :is-loading="isLoading" />
            </div>
            <div class="text-danger">
              <i class="ic-Alert-Icon"></i>
              {{ $t('getparc.actCreation.editCustomFields.confirmationWarning') }}
            </div>
          </LoaderContainer>
        </div>
        <div slot="footer" class="btnsContainer">
          <button
            class="btns btns--cancel"
            @click.stop="waitForConfirmation = false"
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
      <span v-if="allFields && allFields.length && isFileImportContextValid && !exceptionError">
        <i class="ic-Alert-Icon" />
        {{ $t('getparc.actCreation.editCustomFields.infoMessage') }}
      </span>
      <div
        v-else-if="
          (allFields && allFields.length && !isFileImportContextValid && exceptionError) ||
            (!allFields.length && !isFileImportContextValid && exceptionError)
        "
        class="list-unstyled m-0 alert alert-danger"
      >
        {{ exceptionError }}
      </div>
      <span v-else-if="!allFields.length && !isFileImportContextValid && !exceptionError"
        ><i class="ic-Alert-Icon" />{{ $t('getparc.actCreation.editCustomFields.noResult') }}
      </span>
    </div>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import PartnerFields from '@/components/PartnerFields';
import { mapState, mapGetters } from 'vuex';
import { fetchCustomFields } from '@/api/customFields';
import { updateCustomFields, updateCustomAndSpecificFieldsByFile } from '@/api/actCreation';
import Modal from '@/components/Modal';
import { searchLineById, uploadSearchFile } from '@/api/linesActions';
import * as fileUtils from '@/utils/file.js';
import LoaderContainer from '@/components/LoaderContainer';
import ModalSkeleton from '@/components/ui/skeletons/ModalSkeleton';
import { formatBackErrors } from '@/utils/errors';

export default {
  components: {
    ActFormContainer,
    PartnerFields,
    Modal,
    LoaderContainer,
    ModalSkeleton,
  },
  props: {
    useFileImportAsInput: Boolean,
    fileImportAsInputContext: {
      type: Object,
      required: false,
    },
    shouldCheckFieldsInput: Boolean,
  },
  data() {
    return {
      allCustomFields: [],
      allSpecificFields: [],
      allFields: [],
      allFieldsValues: [],
      customFieldsErrors: undefined,
      waitForConfirmation: false,
      canSend: false,
      singleLineFound: undefined,
      exceptionError: undefined,
      isLoading: false,
    };
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters', 'linesActionsResponse']),

    isFileImportContextValid() {
      if (this.fileImportAsInputContext) {
        const customFieldTypeToggle = this.$loGet(
          this.fileImportAsInputContext,
          'customFieldTypeToggle'
        );
        const selectedFile = this.$loGet(this.fileImportAsInputContext, 'selectedFile');
        const selectedIdType = this.$loGet(this.fileImportAsInputContext, 'selectedIdType');

        return (
          !!customFieldTypeToggle && !!selectedFile && !!selectedIdType && !this.exceptionError
        );
      }
      return false;
    },

    canDisableSave() {
      if (this.useFileImportAsInput) {
        if (
          this.fileImportAsInputContext.selectedFile &&
          this.fileImportAsInputContext.selectedIdType &&
          this.fileImportAsInputContext.selectedIdType !== 'none' &&
          !this.exceptionError
        ) {
          return false;
        }
        return true;
      }
      if (!this.canValidate) {
        return true;
      }

      return false;
    },

    partner() {
      if (this.actCreationPrerequisites && this.actCreationPrerequisites.searchById) {
        if (this.singleLineFound) {
          return this.singleLineFound.party;
        }
      }
      return this.$loGet(this.actCreationPrerequisites, 'partner');
    },
    canValidate() {
      if (this.allFields && this.allFields.length && this.canSend) {
        return true;
      }
      return false;
    },
  },
  async mounted() {
    await this.loadSingleLineInfo();
    if (!this.partner) return;
    this.fetchCustomFieldsForPartner();
  },
  methods: {
    async loadSingleLineInfo() {
      if (
        this.actCreationPrerequisites &&
        this.actCreationPrerequisites.searchById &&
        this.linesActionsResponse &&
        this.linesActionsResponse.total === 1
      ) {
        const lineInTable = this.linesActionsResponse.items[0];
        this.singleLineFound = await searchLineById(lineInTable.id);
      }
    },
    async fetchCustomFieldsForPartner() {
      const partnerId = this.partner.id;
      const customFields = await fetchCustomFields(partnerId);
      this.allCustomFields = customFields.customFields.map((c) => {
        if (c.mandatory === 'NONE') {
          c.isOptional = true;
        } else {
          c.isOptional = false;
        }
        return c;
      });
      this.allSpecificFields = customFields.specificFields;
      this.allFields = customFields.customFields.concat(customFields.specificFields);
    },

    getSelectedValue(code) {
      const existingFieldValue = this.allFieldsValues.find((c) => c.code === code);
      if (existingFieldValue) {
        return existingFieldValue.enteredValue;
      }
    },
    onValueChanged(customField, enteredValue) {
      const existingFieldValue = this.allFieldsValues.find((c) => c.code === customField.code);
      if (enteredValue) {
        this.canSend = true;
      } else {
        this.canSend = false;
      }
      if (existingFieldValue) {
        this.allFieldsValues = this.allFieldsValues.map((c) => {
          if (c.code === customField.code) {
            return {
              ...c,
              enteredValue,
            };
          }
          return c;
        });
      } else {
        customField.enteredValue = enteredValue;
        this.allFieldsValues = [...this.allFieldsValues, { ...customField }];
      }
    },
    async validateWithFile(contextValues) {
      let response;
      if (!contextValues.tempDataUuid) {
        response = await uploadSearchFile(
          this.fileImportAsInputContext.selectedFile,
          this.fileImportAsInputContext.selectedIdType
        );
        if (!response.errors || !response.errors.length) {
          response = await updateCustomAndSpecificFieldsByFile(
            response.tempDataUuid,
            contextValues.actDate,
            this.partner.id,
            this.fileImportAsInputContext.customFieldTypeToggle
          );
        }
      } else {
        response = await updateCustomAndSpecificFieldsByFile(
          contextValues.tempDataUuid,
          contextValues.actDate,
          this.partner.id,
          this.fileImportAsInputContext.customFieldTypeToggle
        );
      }

      return response;
    },
    async normalValidation(contextValues) {
      const getCustomFieldValue = (code) => {
        const found = this.allFieldsValues.filter((c) => c.code === code);
        if (found && found.length) {
          return found[0].enteredValue;
        }
        return '';
      };
      const params = {
        partyId: this.partner.id,
        dueDate: contextValues.actDate,
        notifEmail: contextValues.notificationCheck,
        custom1: getCustomFieldValue('custom1'),
        custom2: getCustomFieldValue('custom2'),
        custom3: getCustomFieldValue('custom3'),
        custom4: getCustomFieldValue('custom4'),
        custom5: getCustomFieldValue('custom5'),
        custom6: getCustomFieldValue('custom6'),
        spec1: getCustomFieldValue('spec1'),
        spec2: getCustomFieldValue('spec2'),
        tempDataUuid: contextValues.tempDataUuid,
      };
      const response = await updateCustomFields(
        this.appliedFilters,
        this.selectedLinesForActCreation,
        params
      );
      if (response.errors && response.errors.length) {
        this.waitForConfirmation = false;
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
    async onValidate(contextValues) {
      if (!this.isFileImportContextValid) {
        return this.normalValidation(contextValues);
      } else {
        return this.validateWithFile(contextValues);
      }
    },
    async confirmValdation(containerValidationFn) {
      this.isLoading = true;
      const response = await containerValidationFn();
      this.waitForConfirmation = false;
      return response;
    },
    chekcForErrors() {
      this.waitForConfirmation = false;
      const getCustomFieldValue = (code) => {
        const found = this.allFieldsValues.filter((c) => c.code === code);
        if (found && found.length) {
          return found[0].enteredValue;
        }
        return '';
      };

      this.customFieldsErrors = this.allCustomFields
        .filter((c) => c.mandatory !== 'NONE')
        .filter((c) => {
          const value = getCustomFieldValue(c.code);
          if (!value || value.length === 0) {
            return true;
          }
        })
        .map((c) => c.code);
    },
    checkForExceptionErrors() {
      if (this.fileImportAsInputContext) {
        const selectedFile = this.$loGet(this.fileImportAsInputContext, 'selectedFile');
        if (selectedFile && fileUtils.checkFormat(selectedFile)) {
          this.exceptionError = this.$t('getparc.actCreation.report.DATA_INVALID_FORMAT');
        } else if (selectedFile && fileUtils.checkFileSize(selectedFile)) {
          this.exceptionError = this.$t('getparc.actCreation.report.FILE_SIZE_LIMIT_EXCEEDED');
        } else if (selectedFile && selectedFile.error) {
          this.exceptionError = this.$t('getparc.actCreation.report.' + selectedFile.error);
        } else {
          this.exceptionError = '';
        }
        return this.exceptionError;
      }
    },
  },
  watch: {
    fileImportAsInputContext() {
      this.checkForExceptionErrors();
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
