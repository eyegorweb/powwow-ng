<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-12">
          <slot name="action" />
        </div>
        <!-- zone (gauche IHM) pour la validation de l'upload -->
        <div class="col-7">
          <div class="row">
            <div class="col">
              <button
                :disabled="!canValidateUpload"
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
                    <template>{{ $t('confirmAction') }}</template>
                  </div>
                </div>
                <div slot="footer" class="btnsContainer">
                  <button
                    class="btns btns--cancel"
                    v-if="!isLoading"
                    @click.stop="showValidationModal = false"
                  >
                    {{ $t('cancel') }}
                  </button>
                  <button class="btns btns--confirm" v-if="!isLoading" @click.stop="uploadFile()">
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
        </div>
        <!-- zone (droite IHM) pour le compte rendu -->
        <div class="col-5" :class="{ validationBlocRightFixed: validationBlocRightFixed }">
          <div class="text-right">
            <button @click="cancelAct" class="clear-form">
              {{ $t('cancel') }}
              <i class="ic-Cross-Icon" />
            </button>
          </div>
          <div>
            <div v-if="fileFormatErrors && fileFormatErrors.length > 0">
              <h6 class="text-danger">{{ $t('errors.all') }}</h6>
              <ul class="text-danger list-unstyled">
                <li :key="error.message" v-for="error in fileFormatErrors">
                  {{ error.message }}
                </li>
              </ul>
            </div>

            <div v-if="requestErrors && requestErrors.length > 0">
              <h6 class="text-danger">{{ $t('errors.all') }}</h6>
              <ul class="text-danger list-unstyled">
                <li :key="error.message" v-for="error in requestErrors">
                  {{ error.message }}
                </li>
              </ul>
            </div>

            <FormReport
              v-if="report && haveReportErrors && !requestErrors && !fileFormatErrors"
              :get-export-fn="getExportFn()"
              :data="report"
            />
            <button
              v-if="report && tempDataUuid && !requestErrors"
              :disabled="!report.validated"
              @click="doubleConfirm()"
              class="btn btn-double-validation pl-4 pr-4 pt-2 pb-2"
              :class="{
                'btn-success': report.validated,
                'btn-light': !report.validated,
              }"
            >
              <i v-if="report.validated" class="ic-Check-Icon" />
              {{ $t('confirm') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from '@/components/Modal';
import CircleLoader from '@/components/ui/CircleLoader';
import FormReport from './FormReport';

import { uploadSearchFile, exportLinesFromFileFilter } from '@/api/linesActions';

import { mapState, mapMutations } from 'vuex';
import * as fileUtils from '@/utils/file.js';

export default {
  components: {
    Modal,
    CircleLoader,
    FormReport,
  },
  props: {
    actMutationFn: Function,
    actCode: String,
    validationBlocRightFixed: Boolean,
  },
  data() {
    return {
      tempDataUuid: undefined,
      showValidationModal: false,
      isLoading: false,
      fileFormatErrors: undefined,
      requestErrors: undefined,
      report: undefined,
    };
  },
  computed: {
    ...mapState('actLines', ['selectedFileForActCreation', 'actCreationPrerequisites']),
    canValidateUpload() {
      return this.selectedFileForActCreation && !this.tempDataUuid && !this.fileFormatErrors;
    },
    haveReportErrors() {
      if (!this.report) return 0;
      return this.report.errors.reduce((total, e) => {
        return (total += e.number);
      }, 0);
    },
  },
  methods: {
    ...mapMutations('actLines', [
      'setSelectedFileForActCreation',
      'setSelectedLinesForActCreation',
      'setActToCreate',
      'setActCreationPrerequisites',
    ]),
    ...mapMutations(['flashMessage', 'setPendingExportsStatus', 'confirmAction']),
    cancelAct() {
      this.setActToCreate(null);
      this.setActCreationPrerequisites(null);
      this.setSelectedLinesForActCreation([]);
    },
    resetForm() {
      this.tempDataUuid = undefined;
      this.requestErrors = undefined;
      this.report = undefined;
    },
    validateUploadFileFormat(file) {
      if (fileUtils.checkFormat(file)) {
        this.fileFormatErrors = [
          {
            message: this.$t('getparc.actCreation.report.DATA_INVALID_FORMAT'),
          },
        ];
      } else if (fileUtils.checkFileSize(file)) {
        this.fileFormatErrors = [
          {
            message: this.$t('getparc.actCreation.report.FILE_SIZE_LIMIT_EXCEEDED'),
          },
        ];
      } else if (file.error) {
        this.fileFormatErrors = [
          {
            message: this.$t('getparc.actCreation.report.' + file.error),
          },
        ];
      } else {
        this.fileFormatErrors = undefined;
      }
    },
    async uploadFile() {
      this.isLoading = true;
      const response = await uploadSearchFile(
        this.selectedFileForActCreation,
        this.actCode,
        this.actCreationPrerequisites.partner.id
      );
      if (response && response.validated && response.tempDataUuid && !response.errors.length) {
        this.tempDataUuid = response.tempDataUuid;
        await this.createReport();
      } else if (response && !response.validated && response.errors.length) {
        this.fileFormatErrors = [
          {
            message: this.$t('getparc.actCreation.report.' + response.errors[0].error),
          },
        ];
      }
      this.showValidationModal = false;
      this.isLoading = false;
    },
    async createReport() {
      let params = {
        partyId: this.actCreationPrerequisites.partner.id,
        tempDataUuid: this.tempDataUuid,
        customerAccountId: this.actCreationPrerequisites.billingAccount.id,
        workflowId: this.actCreationPrerequisites.offer.data.id,
        apnCode: this.actCreationPrerequisites.apn.value,
      };
      const response = await this.actMutationFn(params);

      if (response.errors && response.errors.length && !response.tempDataUuid) {
        // failure with request errors
        response.errors.forEach((r) => {
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
          } else if (r.error) {
            const errorMessage = this.$t('getparc.actCreation.report.' + r.error);
            this.requestErrors = [
              {
                message: errorMessage,
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
      } else if (response.errors && response.errors.length && response.tempDataUuid) {
        // success with report errors
        this.report = response;
      } else {
        // success without report errors
        this.confirmRequest();
      }
    },
    confirmRequest() {
      this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });

      // ajouter l'acte à la liste des opérations en cours du module PendingActions
      this.setPendingExportsStatus(true);

      // sortir du mode création acte
      this.setActToCreate(null);
      this.setActCreationPrerequisites(null);
      this.setSelectedLinesForActCreation([]);

      this.resetForm();
      this.setSelectedFileForActCreation(undefined);
    },
    async doubleConfirm() {
      // il y a des lignes ko et des lignes ok, on lance alors la mutation uniquement pour les lignes ok
      let params = {
        partyId: this.actCreationPrerequisites.partner.id,
        tempDataUuid: this.tempDataUuid,
        customerAccountId: this.actCreationPrerequisites.billingAccount.id,
        workflowId: this.actCreationPrerequisites.offer.data.id,
        apnCode: this.actCreationPrerequisites.apn.value,
      };
      const response = await this.actMutationFn(params);
      if (response) {
        this.confirmRequest();
      } else {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      }
    },
    getExportFn() {
      return async (columnsParam, orderBy, exportFormat) => {
        return await exportLinesFromFileFilter(
          ['DATA', 'STATUS'],
          '',
          exportFormat,
          this.tempDataUuid
        );
      };
    },
  },
  watch: {
    selectedFileForActCreation(value) {
      this.resetForm();
      this.validateUploadFileFormat(value);
    },

    actCreationPrerequisites() {
      this.resetForm();
      this.setSelectedFileForActCreation(undefined);
    },
  },
};
</script>

<style lang="scss" scoped>
.validationBlocRightFixed {
  position: absolute;
  right: 0;
  top: 2rem;
}
.clear-form {
  appearance: none;
  outline: none;
  border: none;
  background-color: transparent;
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
