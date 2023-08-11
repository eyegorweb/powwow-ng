<template>
  <div class="col-md-9 extra-bottom-margin">
    <Title
      num="1"
      title="getparc.actLines.step1File"
      :color="actToCreate.color"
      :uppercase="true"
    />
    <DropZone v-model="selectedFile" class="dropZone" />

    <div class="mt-5">
      <ActFormContainer
        :validate-fn="onValidate"
        :can-change-date="false"
        :prevent-send="!canSend"
        fix-on-current-date
        :file="selectedFile"
      >
        <div slot="messages" class="text-info mb-3">
          <div v-if="exceptionError">
            <h6 class="text-danger">{{ $t('errors.all') }}</h6>
            <div class="text-danger">
              {{ exceptionError }}
            </div>
          </div>
        </div>
      </ActFormContainer>
    </div>
  </div>
</template>

<script>
import ActFormContainer from '@/views/GetParc/ActLines/ActCreation/forms/parts/ActFormContainer2.vue';
import Title from '@/views/GetParc/ActLines/Title.vue';
import DropZone from '@/components/ui/DropZone';
import { uploadSearchFile } from '@/api/linesActions';
import { formatBackErrors } from '@/utils/errors';
import { pairingByImportedFile } from '@/api/esim.js';
import { mapMutations } from 'vuex';
import * as fileUtils from '@/utils/file.js';

export default {
  components: {
    Title,
    DropZone,
    ActFormContainer,
  },
  props: {
    actToCreate: Object,
    actCreationPrerequisites: Object,
    appliedFilters: Array,
  },
  data() {
    return {
      file: undefined,
      searchFileResponse: undefined,
      waitForConfirmation: false,
      exceptionError: undefined,
      isLoading: false,
    };
  },
  methods: {
    ...mapMutations('actLines', ['setSelectedFileForActCreation']),
    async doSendPairingRequest(params) {
      const partnerId = this.$loGet(this.actCreationPrerequisites, 'partner.id');
      const tempEidUuid = params.tempDataUuid;
      return await pairingByImportedFile({ partnerId, tempEidUuid });
    },
    async onValidate(contextValues) {
      let response;
      if (!contextValues.tempDataUuid) {
        if (this.file) {
          response = await uploadSearchFile(this.file, 'ICCID');
          // commentaire test
          if (!response.errors || !response.errors.length) {
            response = await this.doSendPairingRequest({
              tempDataUuid: response.tempDataUuid,
            });
          }
        }
      } else {
        response = await this.doSendPairingRequest({
          tempDataUuid: contextValues.tempDataUuid,
        });
      }

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
      if (this.selectedFile) {
        if (this.selectedFile && fileUtils.checkFormat(this.selectedFile)) {
          this.exceptionError = this.$t('getparc.actCreation.report.DATA_INVALID_FORMAT');
        } else if (this.selectedFile && fileUtils.checkFileSize(this.selectedFile)) {
          this.exceptionError = this.$t('getparc.actCreation.report.FILE_SIZE_LIMIT_EXCEEDED');
        } else if (this.selectedFile && this.selectedFile.error) {
          this.exceptionError = this.$t('getparc.actCreation.report.' + this.selectedFile.error);
        } else {
          this.exceptionError = '';
        }
        return this.exceptionError;
      }
    },
  },
  computed: {
    selectedFile: {
      get() {
        return this.file;
      },
      set(newFile) {
        this.setSelectedFileForActCreation(newFile);
        this.file = newFile;
      },
    },
    canSend() {
      if (this.selectedFile && !this.exceptionError) return true;
      return false;
    },
  },
  watch: {
    selectedFile() {
      this.checkForExceptionErrors();
    },
  },
};
</script>

<style lang="scss" scoped></style>
