<template>
  <div>
    <Modal v-if="isAsyncExportAlertOpen">
      <p slot="body">{{ $t('getsim.export-warning') }}</p>
      <div slot="footer">
        <button
          class="modal-default-button btn btn-danger btn-sm"
          @click.stop="isAsyncExportAlertOpen = false"
        >
          {{ $t('cancel') }}
        </button>
        <button
          class="modal-default-button btn btn-success btn-sm ml-1"
          @click.stop="validateExport"
        >
          {{ $t('export') }}
        </button>
      </div>
    </Modal>
    <Modal v-if="isExportFormatChoiceOpen">
      <div slot="body">
        <div class="loader" v-if="showLoader" :class="{ error: haveError }">
          <div>{{ haveError ? messageError : $t('exportLoading') }}</div>
        </div>
        <h4>{{ $t('exportFormat') }} :</h4>
        <div class="row">
          <div class="col text-center">
            <button
              class="btn btn-link export-button export-csv-format"
              @click.stop="exportFile('CSV')"
              :disabled="isLoading"
            >
              <img src="@/assets/csv.svg" alt="csv" />
              <span>CSV</span>
            </button>
          </div>
          <div class="col text-center">
            <button
              :class="{ disableExport: tooManyLinesToExcelExport }"
              class="btn btn-link export-button export-excel-format"
              @click.stop="tooManyLinesToExcelExport || exportFile('EXCEL')"
              :disabled="isLoading"
            >
              <div class="disableExport-tooltip">
                {{ $t('disableExportLinesExceed') }}
              </div>
              <img src="@/assets/excel.svg" alt="excel" />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>
      <div slot="footer" class="footer">
        <div class="exportAll" v-if="!showLoader">
          <div class="exportTypes" v-if="exportPanelParams.exportChoices">
            <Toggle
              :values="exportPanelParams.exportChoices"
              @update="chooseExportChoice"
              no-default
              :key="'expo_togg_' + toggleVersion"
            />
            <UiDropDownChoicesButton
              v-if="
                exportPanelParams.otherExportChoices && exportPanelParams.otherExportChoices.length
              "
              :options="otherExportChoicesLabels"
              :get-export-choice-disabled-message="getExportChoiceDisabledMessage"
              @click="onOtherExportChoice"
              :button-style="{
                padding: '.2rem 0.8rem',
                marginLeft: '.2rem',
              }"
              :is-active="otherExportChoiceLabel !== 'common.others'"
            >
              <span>{{ $t(otherExportChoiceLabel) }}</span>
            </UiDropDownChoicesButton>
          </div>

          <Checkbox
            v-model="exportAll"
            v-if="exportPanelParams.exportAll && !exportPanelParams.exportChoices"
          >
            {{ $t('exportAll') }}
          </Checkbox>
        </div>
        <button class="modal-default-button btn btn-danger btn-sm" @click.stop="closePanel">
          {{ $t('cancel') }}
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal';
import { mapState, mapMutations, mapGetters } from 'vuex';
import { getBaseURL } from '@/utils.js';
import sortBy from 'lodash.sortby';
import Checkbox from '@/components/ui/Checkbox.vue';
import Toggle from '@/components/ui/UiToggle2';
import UiDropDownChoicesButton from '@/components/ui/UiDropDownChoicesButton';

export default {
  components: {
    Modal,
    Checkbox,
    Toggle,
    UiDropDownChoicesButton,
  },

  computed: {
    ...mapGetters(['havePermission']),
    ...mapGetters('actLines', ['appliedFilters']),
    ...mapGetters(['userIsBO', 'userIsPartner', 'userIsGroupPartner', 'userIsOperator']),
    ...mapGetters(['userIsMVNO']),
    ...mapState({
      isExportFormatChoiceOpen: (state) => state.ui.isExportFormatChoiceOpen,
      exportPanelParams: (state) => state.ui.exportPanelParams,
      exportNumberLines: (state) => state.ui.exportNumberLines,
    }),

    tooManyLinesToExcelExport() {
      return this.exportNumberLines >= 500000;
    },
    otherExportChoicesLabels() {
      return this.exportPanelParams
        ? this.exportPanelParams.otherExportChoices.map((e) => e.label)
        : [];
    },

    getExportChoiceDisabledMessage() {
      return (option) => {
        if (this.exportPanelParams && this.exportPanelParams.getExportChoiceDisabledMessage) {
          return this.exportPanelParams.getExportChoiceDisabledMessage(option);
        }
        return false;
      };
    },
  },

  data() {
    return {
      isAsyncExportAlertOpen: false,
      errors: undefined,
      isLoading: false,
      exportFormat: undefined,
      exportAll: false,
      exportChoice: undefined,
      otherExportChoiceLabel: 'common.others',
      showLoader: false,
      haveError: false,
      messageError: undefined,
      forceAsyncExport: false,
      toggleVersion: 0,
      tooLongSyncExportsManagement: true,
    };
  },

  watch: {
    isExportFormatChoiceOpen(value) {
      if (value) {
        this.haveError = false;
        this.errors = undefined;
        this.isLoading = false;
        this.exportFormat = undefined;
        this.showLoader = false;
        this.otherExportChoiceLabel = 'common.others';
      }
    },
    otherExportChoiceLabel(value, oldValue) {
      if (value !== oldValue && oldValue === 'common.others') {
        this.toggleVersion += 1;
      }
    },
  },

  methods: {
    ...mapMutations([
      'closeExportChoice',
      'flashMessage',
      'closeAndResetExportChoice',
      'startDownload',
      'setPendingExportsStatus',
    ]),

    resetState() {
      this.exportChoice = undefined;
    },

    closePanel() {
      this.resetState();
      this.closeExportChoice();
    },

    async validateExport() {
      this.isAsyncExportAlertOpen = false;
      try {
        await this.doExport(this.exportFormat, true, this.exportAll, this.exportChoice);
        this.exportChoice = undefined;
        this.closeAndResetExportChoice();
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      } catch (err) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      }
    },

    async doExport(exportFormat, asyncExportRequest, exportAll, exportChoice) {
      const { columns, exportFn, orderBy, forceAsyncExport } = this.exportPanelParams;
      this.errors = undefined;
      const columnsParam = sortBy(columns, (c) => !c.visible)
        .filter((c) => c.exportId)
        .map((c) => c.exportId);

      this.isLoading = true;

      const downloadResponse = await exportFn(
        columnsParam,
        orderBy,
        exportFormat,
        asyncExportRequest,
        exportAll,
        forceAsyncExport,
        exportChoice
      );

      this.isLoading = false;
      if (downloadResponse.errors) throw downloadResponse.errors;
      return downloadResponse;
    },

    chooseExportChoice(choice) {
      this.exportChoice = choice.id;
      this.otherExportChoiceLabel = 'common.others';
    },

    onOtherExportChoice(label) {
      if (this.exportPanelParams && this.exportPanelParams.otherExportChoices) {
        const choice = this.exportPanelParams.otherExportChoices.find((e) => e.label === label);
        if (choice) {
          this.exportChoice = choice.id;
        }
        this.otherExportChoiceLabel = label;
      }
    },

    async exportFile(exportFormat) {
      if (this.exportPanelParams && this.exportPanelParams.exportChoices && !this.exportChoice) {
        return false;
      }
      this.exportFormat = exportFormat;
      let downloadResponse = undefined;
      if (this.exportPanelParams.forceAsyncExport && this.exportAll) {
        this.closeExportChoice();
        this.showLoader = false;
        setTimeout(() => {
          this.isAsyncExportAlertOpen = true;
        }, 200);
      } else {
        try {
          this.showLoader = true;
          downloadResponse = await this.doExport(
            exportFormat,
            false,
            this.exportAll,
            this.exportChoice
          );
          this.showLoader = false;

          if (downloadResponse.asyncRequired) {
            this.closeExportChoice();
            this.showLoader = false;
            setTimeout(() => {
              this.isAsyncExportAlertOpen = true;
            }, 200);
          } else {
            if (this.tooLongSyncExportsManagement) {
              
              this.setPendingExportsStatus(true);
              this.closeAndResetExportChoice();
              this.showLoader = false;
            } else {
              if (downloadResponse && downloadResponse.downloadUri) {
                this.startDownload(getBaseURL() + downloadResponse.downloadUri);
              } else {
                this.showLoader = true;
                this.haveError = true;
                this.messageError = this.$t('noLinesToExport');
                return this.messageError;
              }
            }

            this.exportChoice = undefined;
            this.closeAndResetExportChoice();
          }
        } catch (err) {
          console.error('Caught export error >>>>>', err);
          this.haveError = true;
          if (this.exportPanelParams.onErrorFn) {
            this.messageError = this.exportPanelParams.onErrorFn(err);
          } else {
            this.messageError = this.$t('exportError');
          }

          return this.messageError;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.disableExport {
  background: rgb(179, 179, 179);
  position: relative;

  &:hover {
    text-decoration: none;
  }
  img {
    filter: grayscale(1);
  }
  span {
    color: white;
  }

  &-tooltip {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 12px;
    z-index: 9;
    background: black;
    color: white;
    width: 100%;
    padding: 1rem;
    border-radius: 5px;
    opacity: 0;
    transition: 0.3s;

    &:hover {
      opacity: 1;
    }
  }
}
.loader {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error {
  color: red;
  font-weight: bold;
}

.footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;

  .exportAll {
    margin-right: 20px;
  }
}

.exportTypes {
  display: flex;
}
</style>
