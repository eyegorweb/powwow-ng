<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-7">
          <div class="row">
            <div class="col d-flex">
              <UiCheckbox v-model="notificationCheck" />
              <span>{{ $t('getparc.actCreation.NOTIFICATION_CHECK') }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <UiDate
                @change="onActDateChange"
                :value="actDate"
                :error="dateError"
                :min-date="minDate"
                class="d-block"
                time-picker
                fixed
              >
                <i slot="icon" class="select-icon ic-Flag-Icon" />
              </UiDate>
            </div>
            <div class="col">
              <button
                :disabled="!canValidateRequest"
                @click="showValidationModal = true"
                class="btn btn-primary pl-4 pr-4 pt-2 pb-2"
              >
                <i class="ic-Edit-Icon" />
                {{ $t('getparc.actCreation.changeService.validateBtn') }}
              </button>

              <Modal v-if="showValidationModal">
                <div slot="body">
                  <div class="text-danger">
                    <i class="ic-Alert-Icon"></i>
                    {{ $t(confirmationMessage) }}
                  </div>
                </div>
                <div slot="footer">
                  <button
                    class="modal-default-button btn btn-danger btn-sm"
                    v-if="!isLoading"
                    @click.stop="showValidationModal = false"
                  >
                    {{ $t('cancel') }}
                  </button>
                  <button
                    class="modal-default-button btn btn-success btn-sm ml-1"
                    v-if="!isLoading"
                    @click.stop="validateFile()"
                  >
                    {{ $t('save') }}
                  </button>
                  <button
                    class="modal-default-button btn btn-light btn-sm ml-1"
                    disabled
                    v-if="isLoading"
                  >
                    {{ $t('processing') }}...
                    <CircleLoader />
                  </button>
                </div>
              </Modal>
            </div>
          </div>
          <slot name="bottom"></slot>
        </div>
        <div class="col-5">
          <div class="text-right">
            <button @click="clearForm" class="clear-form">
              {{ $t('cancel') }}
              <i class="ic-Cross-Icon" />
            </button>
          </div>
          <div>
            <div v-if="requestErrors">
              <h6 class="text-danger">{{ $t('errors.all') }}</h6>
              <ul class="text-danger list-unstyled">
                <li :key="error.message" v-for="error in requestErrors">{{ error.message }}</li>
              </ul>
            </div>

            <FormReport
              v-if="report && (haveBusinessErrors || alwaysShowReport)"
              :get-export-fn="getExportFn()"
              :data="report"
            />
            <button
              v-if="tempDataUuid"
              @click="confirmRequest(true)"
              class="btn btn-success pl-4 pr-4 pt-2 pb-2"
            >
              <span>{{ $t('confirm') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadSearchFile, exportLinesFromFileFilter } from '@/api/linesActions';
import { mapState, mapMutations } from 'vuex';

import FormReport from './FormReport';
import Modal from '@/components/Modal';
import CircleLoader from '@/components/ui/CircleLoader';
import * as fileUtils from '@/utils/file.js';
import UiDate from '@/components/ui/UiDate';
import UiCheckbox from '@/components/ui/Checkbox';
import moment from 'moment';

export default {
  components: {
    FormReport,
    Modal,
    CircleLoader,
    UiDate,
    UiCheckbox,
  },
  props: {
    actMutationFn: Function,
    actCode: String,
    confirmationMessage: String,
    successMessage: String,
    alwaysShowReport: Boolean,
  },
  data() {
    return {
      tempDataUuid: undefined,
      requestError: undefined,
      requestErrors: undefined,
      contextValues: undefined,
      report: undefined,
      disableForced: false,

      showValidationModal: false,
      isLoading: false,

      actDate: null,
      dateError: null,
      notificationCheck: false,
      genericSuccessMessage: '',
    };
  },

  mounted() {
    this.actDate = moment().format('DD/MM/YYYY HH:mm:ss');
    this.genericSuccessMessage = this.$t('genericSuccessMessage');
  },

  watch: {
    selectedFileForActCreation(value) {
      this.resetForm();
      this.validFile(value);
    },

    actCreationPrerequisites() {
      this.resetForm();
      this.setSelectedFileForActCreation(undefined);
    },
  },
  computed: {
    ...mapState('actLines', ['selectedFileForActCreation', 'actCreationPrerequisites']),
    canValidateRequest() {
      if (this.disableForced) {
        return false;
      } else {
        return this.selectedFileForActCreation && !this.tempDataUuid;
      }
    },
    haveBusinessErrors() {
      if (!this.report) return 0;
      return this.report.errors.reduce((total, e) => {
        return (total += e.number);
      }, 0);
    },
    minDate() {
      return moment().format('DD/MM/YYYY HH:mm:ss');
    },
  },
  methods: {
    ...mapMutations('actLines', [
      'setSelectedFileForActCreation',
      'setActToCreate',
      'setActCreationPrerequisites',
      'setSelectedLinesForActCreation',
    ]),
    ...mapMutations(['flashMessage']),
    onActDateChange(value) {
      this.actDate = value;
    },
    clearForm() {
      this.setActToCreate(null);
      this.setActCreationPrerequisites(null);
      this.setSelectedLinesForActCreation([]);
    },
    getExportFn() {
      return async (columnsParam, orderBy, exportFormat) => {
        return await exportLinesFromFileFilter(
          [
            'UPLOAD_ID',
            'UPLOAD_CREATOR',
            'UPLOAD_DATE',
            'UPLOAD_TYPE',
            'DATA',
            'NEW_DATA',
            'STATUS',
          ],
          '',
          exportFormat,
          this.tempDataUuid
        );
      };
    },

    validFile(file) {
      if (fileUtils.checkFormat(file)) {
        this.disableForced = true;
        this.requestErrors = [
          {
            message: this.$t('getparc.actCreation.report.DATA_INVALID_FORMAT'),
          },
        ];
      } else if (fileUtils.checkFileSize(file)) {
        this.disableForced = true;
        this.requestErrors = [
          {
            message: this.$t('getparc.actCreation.report.FILE_SIZE_LIMIT_EXCEEDED'),
          },
        ];
      } else if (file.error) {
        this.disableForced = true;
        this.requestErrors = [
          {
            message: this.$t('getparc.actCreation.report.' + file.error),
          },
        ];
      } else {
        this.disableForced = false;
      }
    },

    resetForm() {
      this.tempDataUuid = undefined;
      this.requestErrors = undefined;
      this.report = undefined;
      this.contextValues = undefined;
    },
    async doRequest(contextValues) {
      const response = await uploadSearchFile(
        this.selectedFileForActCreation,
        this.actCode,
        this.actCreationPrerequisites.partner.id
      );
      if (response.errors && response.errors.length) {
        response.errors.forEach(r => {
          if (r.error === 'FILE_MAX_LINE_NUMBER_INVALID') {
            const count =
              r.data && r.data.maxNumbersPerFileUpload ? r.data.maxNumbersPerFileUpload : '';
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
                message: this.$t('getparc.actCreation.report.' + r.key),
              },
            ];
          }
        });

        return { stayInForm: true };
      } else {
        this.tempDataUuid = response.tempDataUuid;
        this.contextValues = contextValues;
      }

      this.report = response;
      if (this.alwaysShowReport || this.haveBusinessErrors) {
        return { stayInForm: true };
      } else {
        return await this.confirmRequest();
      }
    },
    haveErrors() {
      if (this.excludeDefaultFields) return false;

      this.dateError = undefined;
      if (!this.actDate) {
        this.dateError = 'errors.mandatory';
        return true;
      }
      return false;
    },

    async doValidationRequest() {
      if (this.haveErrors()) return [];
      const messages = [];

      const response = await this.doRequest({
        actDate: this.actDate,
        notificationCheck: this.notificationCheck,
      });

      if (!response) {
        messages.push({ level: 'danger', message: 'genericErrorMessage' });
      }

      if (response) {
        if (response.stayInForm) {
          this.showValidationModal = false;
          this.isLoading = false;
          return [];
        }

        if (response.errors) {
          const errorMessages = response.errors.map(e => {
            return { level: 'danger', message: e.message };
          });
          messages.push(...errorMessages);
        } else {
          messages.push({ level: 'success', message: this.genericSuccessMessage });

          // sortir du mode création acte
          this.setActToCreate(null);
          this.setActCreationPrerequisites(null);
          this.setSelectedLinesForActCreation([]);
        }
      }

      return messages;
    },

    async validateFile() {
      this.isLoading = true;
      const messages = await this.doValidationRequest();
      if (!messages.length) return;
      for (let i = 0; i < messages.length; i++) {
        this.flashMessage(messages[i]);
      }
      this.showValidationModal = false;
      this.isLoading = false;
    },

    async confirmRequest(showMessage = false) {
      const params = {
        notifEmail: this.contextValues.notificationCheck,
        dueDate: this.contextValues.actDate,
        partyId: this.actCreationPrerequisites.partner.id, // partner id

        tempDataUuid: this.tempDataUuid,
      };
      this.requestErrors = undefined;
      const response = await this.actMutationFn(params);
      if (response.errors) {
        this.requestErrors = response.errors;
      } else {
        if (showMessage) {
          const successMessage = this.successMessage
            ? this.$t(this.successMessage)
            : this.$t('genericSuccessMessage');
          this.flashMessage({ level: 'success', message: successMessage });
        }
        // sortir du mode création acte
        this.setActToCreate(null);
        this.setActCreationPrerequisites(null);
        this.setSelectedLinesForActCreation([]);

        this.resetForm();
        this.setSelectedFileForActCreation(undefined);
      }

      return response;
    },
  },
};
</script>

<style lang="scss" scoped>
.to-bottom {
  align-items: flex-end;
  display: flex;
  margin-bottom: 1rem;
}

.clear-form {
  appearance: none;
  outline: none;
  border: none;
  background-color: transparent;
}
</style>
