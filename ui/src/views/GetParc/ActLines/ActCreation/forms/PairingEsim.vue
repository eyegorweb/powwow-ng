<template>
  <div>
    <ActFormContainer
      :validate-fn="onValidate"
      disabled-notification-check
      :can-change-date="false"
      :prevent-send="preventSend"
      :file="file"
      fix-on-current-date
    >
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
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import { mapState, mapGetters, mapMutations } from 'vuex';
import { uploadSearchFile } from '@/api/linesActions';
import { pairingByImportedFile, pairingByStockedEid } from '@/api/esim.js';
import { formatBackErrors } from '@/utils/errors';
import * as fileUtils from '@/utils/file.js';

export default {
  components: {
    ActFormContainer,
  },
  props: {
    fileImportAsInputContext: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      exceptionError: undefined,
      file: undefined,
    };
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters', 'linesActionsResponse']),
    preventSend() {
      const selectedFile = this.$loGet(this.fileImportAsInputContext, 'selectedFile');
      if (this.actCreationPrerequisites && this.actCreationPrerequisites.filePairing) {
        const preventSend =
          (selectedFile && fileUtils.checkFormat(selectedFile)) ||
          (selectedFile && fileUtils.checkFileSize(selectedFile)) ||
          fileUtils.checkFileSize(selectedFile);
        return (
          (this.fileImportAsInputContext && !this.fileImportAsInputContext.selectedFile) ||
          (this.fileImportAsInputContext &&
            this.fileImportAsInputContext.selectedFile &&
            preventSend)
        );
      }
      return false;
    },
  },
  methods: {
    ...mapMutations('actLines', ['setSelectedFileForActCreation']),
    async onValidate() {
      let response;
      const partnerId = this.$loGet(this.actCreationPrerequisites, 'partner.id');
      let simCardInstanceIds = [];
      if (this.selectedLinesForActCreation) {
        simCardInstanceIds = this.selectedLinesForActCreation.map((a) => a.id);
      }

      if (this.fileImportAsInputContext.selectedFile) {
        response = await uploadSearchFile(this.fileImportAsInputContext.selectedFile, 'EID');
        const tempEidUuid = response.tempDataUuid;
        if (!response.errors || !response.errors.length) {
          response = await pairingByImportedFile({ partnerId, tempEidUuid, simCardInstanceIds });
        }
      } else {
        const simCardTypeId = this.$loGet(this.actCreationPrerequisites, 'simcardType.id');
        response = await pairingByStockedEid(
          partnerId,
          this.appliedFilters,
          simCardTypeId,
          simCardInstanceIds
        );
      }

      if (response && response.errors && response.errors.length) {
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
          } else if (e.key === 'eid') {
            errorMessage = this.$t('getparc.actCreation.report.errors.eid');
          } else if (e.key === 'eid_simcardInstanceIds') {
            errorMessage = this.$t('getparc.actCreation.report.errors.eid_simcardInstanceIds');
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
    checkForExceptionErrors() {
      if (this.fileImportAsInputContext) {
        const selectedFile = this.$loGet(this.fileImportAsInputContext, 'selectedFile');
        if (selectedFile) {
          this.setSelectedFileForActCreation(selectedFile);
          this.file = selectedFile;
        }
        if (selectedFile && fileUtils.checkFormat(selectedFile)) {
          this.exceptionError = this.$t('getparc.actCreation.report.DATA_INVALID_FORMAT');
        } else if (selectedFile && fileUtils.checkFileSize(selectedFile)) {
          this.exceptionError = this.$t('getparc.actCreation.report.FILE_SIZE_LIMIT_EXCEEDED');
        } else if (selectedFile && selectedFile.error) {
          this.exceptionError = this.$t('getparc.actCreation.report.' + selectedFile.error);
        } else {
          this.exceptionError = undefined;
        }
        return this.exceptionError;
      }
    },
  },
  watch: {
    fileImportAsInputContext(newFile, oldFile) {
      if (newFile.selectedFile && oldFile.selectedFile) {
        if (newFile.selectedFile.name !== oldFile.selectedFile.name) {
          this.checkForExceptionErrors();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dropZone {
  width: 100%;
}
</style>
