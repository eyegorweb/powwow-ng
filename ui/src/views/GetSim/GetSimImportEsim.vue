<template>
  <BaseDetailPanelContent>
    <div class="overview-container m-3 bg-white">
      <div class="overview-item mr-5" v-if="!userIsPartner">
        <h6>{{ $t('getparc.actLines.step1Partner') }}</h6>
        <PartnersPart @setpartner="setPartner" esim />
      </div>

      <div class="overview-item mr-5">
        <h6>{{ $t('getparc.actLines.typeSimCard') }}</h6>
        <SimCardsTypePart
          :key="`simcards_${selectedPartner ? selectedPartner.label : ''}`"
          :partner="selectedPartner"
          @set:simcard="setTypeSimCard"
          category="ESIM"
        />
      </div>

      <div class="overview-item mr-5">
        <h6>{{ $t('getsim.stocks.importEid') }} :</h6>
        <FileSelect
          v-model="fileMeta"
          :placeholder="placeholder"
          :disabled="!selectedTypeSimCard"
          :is-loading="isLoading"
        />

        <div v-if="fileResponse && !requestErrors && !isLoading">
          <div v-if="fileResponse.tempDataUuid">
            <ul class="list-unstyled m-0">
              <li>
                <i class="ic-Check-Icon mr-2 text-success" />
                {{ fileResponse.validated }}
                {{ $t('getparc.actLines.fileImport.foundSimcards') }}.
              </li>
              <li v-if="totalNotCompatible > 0">
                <i class="ic-Cross-Icon mr-2 text-danger" />
                {{ totalNotCompatible }}
                {{ $t('getparc.actLines.fileImport.rejectedLines') }} :
                <ul class="list-styled">
                  <li v-for="e in fileResponse.errors" :key="e.key">
                    {{
                      $t('getparc.actLines.fileImport.errors.import.' + e.key, {
                        count: e.number,
                        idType: 'EID',
                      })
                    }}
                  </li>
                </ul>
              </li>
            </ul>
            <div class="mt-5">
              <button
                :disabled="!fileResponse.validated"
                @click="confirmRequest(true)"
                class="btn btn-block"
                :class="{
                  'btn-success': fileResponse.validated,
                  'btn-light': !fileResponse.validated,
                }"
              >
                <span>{{ $t('confirm') }}</span>
              </button>
            </div>
          </div>
        </div>

        <div v-else-if="fileResponse && !!requestErrors && !isLoading">
          <ul class="list-unstyled m-0">
            <li class="item" v-for="e in fileResponse.errors" :key="e.key">
              <div
                v-if="e.key === 400 && e.error === 'FILE_LINE_NUMBER_INVALID'"
                class="alert alert-danger"
                role="alert"
              >
                {{ $t('getparc.actCreation.report.FILE_LINE_NUMBER_INVALID') }}
              </div>
              <div
                v-else-if="e.key === 400 && e.error === 'FILE_MAX_LINE_NUMBER_INVALID'"
                class="alert alert-danger"
                role="alert"
              >
                {{
                  $t('getparc.actCreation.report.FILE_MAX_LINE_NUMBER_INVALID', {
                    count: e.data.maxNumbersPerFileUpload,
                  })
                }}
              </div>
              <div
                v-else-if="e.key === 422 && e.error === 'FILE_CONTENT_INVALID'"
                class="alert alert-danger"
                role="alert"
              >
                {{ $t('getparc.actCreation.report.FILE_CONTENT_INVALID') }}
              </div>
              <div v-else-if="e.key === 500" class="alert alert-warning" role="alert">
                {{ $t('getparc.actCreation.report.timeout') }}
              </div>
              <div v-else class="alert alert-danger" role="alert">
                {{ $t('genericErrorMessage') }}
              </div>
            </li>
          </ul>
        </div>

        <div
          v-else-if="!fileResponse && localError && !isLoading"
          class="alert alert-danger"
          role="alert"
        >
          {{ localError }}
        </div>
      </div>
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import FileSelect from '@/components/ui/FileSelect';
import PartnersPart from '@/views/GetParc/ActLines/ActCreation/prerequisites/parts/PartnersPart';
import SimCardsTypePart from '@/views/GetParc/ActLines/ActCreation/prerequisites/parts/SimCardsTypePart.vue';
import { uploadFileEsimCards, importEsim } from '@/api/linesActions';
import { mapGetters, mapMutations } from 'vuex';
import * as fileUtils from '@/utils/file.js';

export default {
  name: 'GetSimImportEsim',

  components: {
    BaseDetailPanelContent,
    FileSelect,
    PartnersPart,
    SimCardsTypePart,
  },

  data() {
    return {
      selectedPartner: undefined,
      isLoading: false,
      chosenBillingAccount: undefined,
      selectedTypeSimCard: undefined,
      localFileMeta: undefined,
      fileResponse: undefined,
      placeholder: this.$t('getsim.details.fromFile.import-file'),
      successMessage: undefined,
      localError: undefined,
    };
  },

  mounted() {
    if (this.userIsPartner) {
      this.selectedPartner = this.singlePartner;
    }
  },

  computed: {
    ...mapGetters(['userIsPartner', 'singlePartner']),
    fileMeta: {
      get() {
        return this.localFileMeta;
      },

      async set(newFile) {
        this.localFileMeta = newFile;
        if (newFile) {
          this.isLoading = true;
          this.localError = this.getLocalError(newFile);
          if (!this.localError) {
            this.fileResponse = await uploadFileEsimCards(newFile);
            this.$emit('response', {
              file: newFile,
              ...this.fileResponse,
            });
          } else {
            this.fileResponse = undefined;
          }
          this.isLoading = false;
        }
      },
    },
    totalNotCompatible() {
      if (!this.fileResponse.errors) {
        return 0;
      }
      return this.fileResponse.errors.reduce((total, e) => {
        return (total += e.number);
      }, 0);
    },
    requestErrors() {
      if (!this.fileResponse) return false;
      return this.fileResponse.errors.find((f) => f.key === 400 || f.key === 422 || f.key === 500);
    },
  },

  methods: {
    ...mapMutations(['flashMessage']),
    getLocalError(fileMeta) {
      if (!fileMeta) return;

      if (fileUtils.checkFormat(fileMeta)) {
        return this.$t('getparc.actCreation.report.DATA_INVALID_FORMAT');
      } else if (fileUtils.checkFileSize(fileMeta)) {
        return this.$t('getparc.actCreation.report.FILE_SIZE_LIMIT_EXCEEDED');
      }

      if (fileMeta.error) {
        return this.$t('getparc.actCreation.report.' + fileMeta.error);
      }
      return undefined;
    },

    async confirmRequest(showMessage = false) {
      this.isLoading = true;
      const response = await importEsim(
        this.selectedPartner.id,
        this.selectedTypeSimCard.id,
        this.fileResponse.tempDataUuid
      );

      if (response.errors && response.errors.length) {
        this.fileResponse.errors = response.errors;
        if (!this.requestErrors)
          this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        if (showMessage) {
          const successMessage = this.successMessage
            ? this.$t(this.successMessage)
            : this.$t('genericSuccessMessage');
          this.flashMessage({ level: 'success', message: successMessage });
        }
        this.resetForm();
      }
      this.isLoading = false;
      return response;
    },
    resetForm() {
      this.fileResponse = undefined;
    },

    setPartner(chosenPartner) {
      this.selectedPartner = chosenPartner;
    },

    setTypeSimCard(simcard) {
      this.selectedTypeSimCard = simcard;
    },
  },
};
</script>
