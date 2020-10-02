<template>
  <div>
    <BaseDetailPanelContent>
      <div class="overview-container m-3 bg-white">
        <div class="overview-item mr-5">
          <h6>{{ $t('getparc.actLines.step1Partner') }}</h6>
          <PartnersPart @setpartner="setPartner" />
        </div>
        <div class="overview-item mr-5">
          <h6>{{ $t('getparc.actLines.billingAccount') }}</h6>
          <BillingAccountsPart
            :key="`billingAccount_${selectedPartner ? selectedPartner.label : ''}`"
            :partner="selectedPartner"
            @set:billingAccount="setBillingAccount"
          />
        </div>
        <div class="overview-item mr-5">
          <h6>{{ $t('getparc.actLines.typeSimCard') }}</h6>
          <SimCardsTypePart :partner="selectedPartner" @set:simcard="setTypeSimCard" />
        </div>
        <div class="overview-item mr-5">
          <h6>{{ $t('getparc.actLines.fileImport.titleSimCard') }} :</h6>
          <FileSelect
            v-model="fileMeta"
            :placeholder="placeholder"
            :disabled="!selectedTypeSimCard"
          />
          <div v-if="fileResponse && !error">
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
                        idType: 'ICCID',
                      })
                    }}
                  </li>
                </ul>
              </li>
            </ul>
            <div v-if="fileResponse.tempDataUuid" class="mt-5">
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
          <div v-if="localError" class="alert alert-danger" role="alert">{{ localError }}</div>
        </div>
      </div>
    </BaseDetailPanelContent>
  </div>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import FileSelect from '@/components/ui/FileSelect';
import PartnersPart from './ActCreation/prerequisites/parts/PartnersPart';
import BillingAccountsPart from './ActCreation/prerequisites/parts/BillingAccountsPart';
import SimCardsTypePart from './ActCreation/prerequisites/parts/SimCardsTypePart';
import { uploadFileSimCardsFromLines, importIccidsFromLines } from '@/api/linesActions';
import { mapMutations } from 'vuex';
import * as fileUtils from '@/utils/file.js';

export default {
  components: {
    BaseDetailPanelContent,
    FileSelect,
    PartnersPart,
    BillingAccountsPart,
    SimCardsTypePart,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      selectedPartner: null,
      chosenBillingAccount: null,
      selectedTypeSimCard: undefined,
      localFileMeta: undefined,
      fileResponse: undefined,
      placeholder: this.$t('getsim.details.fromFile.import-file'),
      successMessage: undefined,
      localError: undefined,
    };
  },
  computed: {
    fileMeta: {
      get() {
        return this.localFileMeta;
      },

      async set(newFile) {
        this.localFileMeta = newFile;

        if (newFile) {
          this.localError = this.getLocalError(newFile);
          if (!this.localError) {
            this.fileResponse = await uploadFileSimCardsFromLines(newFile);
            if (this.fileResponse && this.fileResponse.error) {
              this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
            } else {
              this.$emit('response', {
                file: newFile,
                ...this.fileResponse,
              });
            }

          }
        }
      },
    },
    error() {
      if (!this.fileResponse) return false;
      return this.fileResponse.error;
    },
    totalNotCompatible() {
      if (!this.fileResponse.errors) {
        return 0;
      }
      return this.fileResponse.errors.reduce((total, e) => {
        return (total += e.number);
      }, 0);
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
      return;
    },
    async confirmRequest(showMessage = false) {
      const response = await importIccidsFromLines(
        this.selectedPartner.id,
        this.chosenBillingAccount.id,
        this.selectedTypeSimCard.id,
        this.fileResponse.tempDataUuid
      );

      if (response.errors && response.errors.length) {
        this.fileResponse.errors = response.errors;
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
      return response;
    },
    resetForm() {
      this.fileResponse = undefined;
    },
    setPartner(chosenPartner) {
      this.selectedPartner = chosenPartner;
    },
    setBillingAccount(billingAccount) {
      this.chosenBillingAccount = billingAccount;
    },
    setTypeSimCard(simcard) {
      this.selectedTypeSimCard = simcard;
    },
  },
};
</script>

<style lang="scss" scoped></style>
