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
      >
        <div slot="messages" class="text-info">
          <div v-if="exceptionError">{{ exceptionError }}</div>
          <!-- <span v-if="allFields && allFields.length && isFileImportContextValid && !exceptionError">
            <i class="ic-Alert-Icon" />
            {{ $t('getparc.actCreation.editCustomFields.infoMessage') }}
          </span> -->
          <!-- <div
            v-else-if="
              (allFields && allFields.length && !isFileImportContextValid && exceptionError) ||
                (!allFields.length && !isFileImportContextValid && exceptionError)
            "
            class="list-unstyled m-0 alert alert-danger"
          >
            {{ exceptionError }}
          </div> -->
          <!-- <span v-else-if="!allFields.length && !isFileImportContextValid && !exceptionError"
            ><i class="ic-Alert-Icon" />{{ $t('getparc.actCreation.editCustomFields.noResult') }}
          </span> -->
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
import { mapState, mapMutations } from 'vuex';

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
      return pairingByImportedFile({ partnerId, tempEidUuid });
    },
    async onValidate(contextValues) {
      if (!contextValues.tempDataUuid) {
        if (this.file) {
          this.searchFileResponse = await uploadSearchFile(this.file, 'EID');
          if (this.searchFileResponse.errors && this.searchFileResponse.errors.length) {
            this.waitForConfirmation = false;
            let errorMessage = '',
              massActionLimitError = '',
              count;
            const formatted = formatBackErrors(this.searchFileResponse.errors)
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
              errors: this.searchFileResponse.errors,
              validationError: {
                validated: this.searchFileResponse.validated,
                tempDataUuid: this.searchFileResponse.tempDataUuid,
              },
            };
          }

          return this.doSendPairingRequest({
            tempDataUuid: this.searchFileResponse.tempDataUuid,
          });
        }
      } else {
        return this.doSendPairingRequest({
          tempDataUuid: contextValues.tempDataUuid,
        });
      }
    },
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation']),
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
      if (this.selectedFile) return true;
      return false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
