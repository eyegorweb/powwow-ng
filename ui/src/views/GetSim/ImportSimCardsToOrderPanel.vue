<template>
  <BaseDetailPanelContent>
    <div class="overview-container m-3 bg-white">
      <div class="overview-item mr-5">
        <h6>{{ $t('col.partner') }}:</h6>
        <p>{{ partner }}</p>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getparc.history.col.details') }}:</h6>
        <p>{{ details }}</p>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getparc.actLines.fileImport.titleSimCard') }} :</h6>
        <FileSelect v-model="fileMeta" :placeholder="placeholder" />
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
        <div v-if="error" class="alert alert-danger" role="alert">{{ fileMeta.error }}</div>
      </div>
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import FileSelect from '@/components/ui/FileSelect';
import { uploadFileSimCards } from '@/api/linesActions';
import { importIccids } from '@/api/orders';
import { mapMutations } from 'vuex';

export default {
  components: {
    BaseDetailPanelContent,
    FileSelect,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      fileMeta: undefined,
      fileResponse: undefined,
      placeholder: this.$t('getsim.details.fromFile.import-file'),
      successMessage: undefined,
    };
  },
  computed: {
    partner() {
      return this.content ? this.content.order.party.name : '';
    },
    orderId() {
      return this.content ? this.content.order.id : '';
    },
    details() {
      return `${this.$t('getsim.details.title', { id: this.orderId })} - ${
        this.content.order.quantity
      } cartes - ${this.content.order.creationDate}`;
    },
    error() {
      if (!this.fileResponse) return false;
      return this.fileResponse.error;
    },
    selectedFile() {
      if (!this.fileMeta) return null;
      return this.fileMeta;
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
    async confirmRequest(showMessage = false) {
      const response = await importIccids(this.orderId, this.fileResponse.tempDataUuid);

      if (response.errors && response.errors.length) {
        this.fileResponse.errors = response.errors;
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        if (showMessage) {
          const successMessage = this.successMessage
            ? this.$t(this.successMessage)
            : 'Opération effectuée avec succès';
          this.flashMessage({ level: 'success', message: successMessage });
        }
        this.resetForm();
      }
      return response;
    },
    resetForm() {
      this.fileResponse = undefined;
    },
  },
  watch: {
    async selectedFile(newFile) {
      if (newFile) {
        this.fileResponse = await uploadFileSimCards(newFile, this.orderId);
        this.$emit('response', {
          file: newFile,
          ...this.fileResponse,
        });
      }
    },
    error() {
      if (this.fileMeta.type !== 'application/vnd.ms-excel') {
        this.fileMeta.error = this.$t('getparc.actCreation.report.DATA_INVALID_FORMAT');
      } else if (this.fileMeta.size > 1000000) {
        this.fileMeta.error = this.$t('getparc.actCreation.report.DATA_SIZE_EXCEED');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.data-detail-container .overview-container .overview-item:nth-child(2) {
  border-bottom: none;
}
</style>
