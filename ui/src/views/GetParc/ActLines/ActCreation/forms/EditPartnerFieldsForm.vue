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
          <div class="text-danger">
            <i class="ic-Alert-Icon"></i>
            {{ $t('getparc.actCreation.editCustomFields.confirmationWarning') }}
          </div>
        </div>
        <div slot="footer">
          <button
            class="modal-default-button btn btn-danger btn-sm"
            @click.stop="waitForConfirmation = false"
          >
            {{ $t('cancel') }}
          </button>
          <button
            class="modal-default-button btn btn-success btn-sm ml-1"
            @click.stop="confirmValdation(containerValidationFn)"
          >
            {{ $t('save') }}
          </button>
        </div>
      </Modal>
    </div>
    <div slot="messages" class="text-info">
      <span
        v-if="allFields && allFields.length && isFileImportContextValid && !requestErrors.length"
      >
        <i class="ic-Alert-Icon" />
        {{ $t('getparc.actCreation.editCustomFields.infoMessage') }}
      </span>
      <ul
        v-else-if="
          (allFields &&
            allFields.length &&
            !isFileImportContextValid &&
            requestErrors.length > 0) ||
            (!allFields.length && !isFileImportContextValid && requestErrors.length > 0)
        "
        class="list-unstyled m-0 alert alert-danger"
      >
        <li class="item" v-for="e in requestErrors" :key="e.key">{{ e.message }}</li>
      </ul>
      <span v-else-if="!allFields.length && !isFileImportContextValid && !requestErrors.length"
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

export default {
  components: {
    ActFormContainer,
    PartnerFields,
    Modal,
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
      requestErrors: [],
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
          !!customFieldTypeToggle &&
          !!selectedFile &&
          !!selectedIdType &&
          !this.requestErrors.length
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
          !this.requestErrors.length
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
        response.errors.forEach((r) => {
          if (r.extensions && r.extensions.error) {
            if (r.extensions.error === 'MassActionLimit') {
              const count = r.extensions && r.extensions.limit ? r.extensions.limit : '';
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
          }
        });

        return { errors: response.errors };
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
      const response = await containerValidationFn();
      this.waitForConfirmation = false;
      return response;
    },
    chekcForErrors() {
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
    checkForRequestErrors() {
      if (this.fileImportAsInputContext) {
        const selectedFile = this.$loGet(this.fileImportAsInputContext, 'selectedFile');
        if (selectedFile && fileUtils.checkFormat(selectedFile)) {
          this.requestErrors = [
            {
              message: this.$t('getparc.actCreation.report.DATA_INVALID_FORMAT'),
            },
          ];
        } else if (selectedFile && fileUtils.checkFileSize(selectedFile)) {
          this.requestErrors = [
            {
              message: this.$t('getparc.actCreation.report.FILE_SIZE_LIMIT_EXCEEDED'),
            },
          ];
        } else if (selectedFile && selectedFile.error) {
          this.requestErrors = [
            {
              message: this.$t('getparc.actCreation.report.' + selectedFile.error),
            },
          ];
        } else {
          this.requestErrors = [];
        }
        return this.requestErrors;
      }
    },
  },
  watch: {
    fileImportAsInputContext() {
      this.checkForRequestErrors();
    },
  },
};
</script>

<style lang="scss" scoped></style>
