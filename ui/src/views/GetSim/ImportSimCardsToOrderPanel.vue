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
        <FileSelect v-model="fileMeta" :placeholder="placeholder" :is-loading="isLoading" />

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
                        idType: 'ICCID',
                      })
                    }}
                  </li>
                </ul>
              </li>
            </ul>
            <div class="mt-5">
              <button
                v-if="!isLoadingForConfirmation"
                :disabled="!fileResponse.validated"
                @click.prevent="confirmRequest(true)"
                class="btn btn-block"
                :class="{
                  'btn-success': fileResponse.validated,
                  'btn-light': !fileResponse.validated,
                }"
              >
                <span>{{ $t('confirm') }}</span>
              </button>
              <button
                class="btn btn-light btn-block btn-sm"
                disabled
                v-if="isLoadingForConfirmation"
              >
                {{ $t('processing') }}...
                <CircleLoader />
              </button>
            </div>
          </div>
        </div>

        <div v-else-if="fileResponse && !!requestErrors && !isLoading">
          <ul class="list-unstyled m-0">
            <li class="item" v-for="(e, index) in fileResponse.errors" :key="index">
              <div
                v-if="e.key === 422 && e.error === 'FILE_LINE_NUMBER_INVALID'"
                class="alert alert-danger"
                role="alert"
              >
                {{ $t('getparc.actCreation.report.FILE_LINE_NUMBER_INVALID') }}
              </div>
              <div
                v-else-if="e.key === 422 && e.error === 'FILE_MAX_LINE_NUMBER_INVALID'"
                class="alert alert-danger"
                role="alert"
              >
                {{
                  $t('getparc.actCreation.report.FILE_MAX_LINE_NUMBER_INVALID', {
                    count: e.maxNumbersPerFileUpload,
                  })
                }}
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
import CircleLoader from '@/components/ui/CircleLoader';
import { uploadFileSimCards } from '@/api/linesActions';
import { importIccids } from '@/api/orders';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import * as fileUtils from '@/utils/file.js';

export default {
  components: {
    BaseDetailPanelContent,
    FileSelect,
    CircleLoader,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      localFileMeta: undefined,
      fileResponse: undefined,
      placeholder: this.$t('getsim.details.fromFile.import-file'),
      successMessage: undefined,
      localError: undefined,
      pageLimit: 20,
      isLoading: false,
      isLoadingForConfirmation: false,
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
    };
  },
  computed: {
    ...mapGetters('getsim', ['appliedFilters', 'orderPage']),
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
    requestErrors() {
      if (!this.fileResponse) return false;
      return this.fileResponse.errors.find(
        (f) => f.key === 400 || f.key === 422 || f.key === 500 || f.error === 'unknown'
      );
    },
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
            this.fileResponse = await uploadFileSimCards(newFile, this.orderId);
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
    getPageInfo() {
      return { page: this.page - 1, limit: this.pageLimit };
    },
    page() {
      return this.orderPage || 0;
    },
  },

  methods: {
    ...mapMutations(['flashMessage']),
    ...mapActions('getsim', ['fetchOrdersFromApi']),
    getLocalError(fileMeta) {
      if (!fileMeta) return;

      if (fileUtils.checkFormat(fileMeta)) {
        return this.$t('getparc.actCreation.report.DATA_INVALID_FORMAT');
      } else if (fileUtils.checkFileSize(fileMeta)) {
        return this.$t('getparc.actCreation.report.DATA_SIZE_EXCEED');
      }

      if (fileMeta.error) {
        return this.$t('getparc.actCreation.report.' + fileMeta.error);
      }

      return undefined;
    },
    async confirmRequest(showMessage = false) {
      this.isLoadingForConfirmation = true;
      const response = await importIccids(this.orderId, this.fileResponse.tempDataUuid);

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
        this.fetchOrders();
        this.resetForm();
      }
      this.isLoadingForConfirmation = false;
      return response;
    },
    resetForm() {
      this.fileResponse = undefined;
    },
    async fetchOrders() {
      this.fetchOrdersFromApi({
        orderBy: this.orderBy,
        pageInfo: this.getPageInfo,
        appliedFilters: this.appliedFilters,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.data-detail-container .overview-container .overview-item:nth-child(2) {
  border-bottom: none;
}
</style>
