<template>
  <Fragment>
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
          <div>{{ haveError ? $t('exportError') : $t('exportLoading') }}</div>
        </div>
        <h4>{{ $t('exportFormat') }} :</h4>
        <div class="row">
          <div class="col text-center">
            <button
              class="btn btn-link export-button"
              @click.stop="exportFile('CSV')"
              :disabled="isLoading"
            >
              <img src="@/assets/csv.svg" alt="csv" />
              <span>CSV</span>
            </button>
          </div>
          <div class="col text-center">
            <button
              class="btn btn-link export-button"
              @click.stop="exportFile('EXCEL')"
              :disabled="isLoading"
            >
              <img src="@/assets/excel.svg" alt="excel" />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>
      <div slot="footer" class="footer">
        <div class="exportAll" v-if="!showLoader">
          <div class="exportTypes" v-if="exportPanelParams.multiExport">
            <Toggle :values="exportTypes" @update="exportChoice = $event.id" />
          </div>

          <Checkbox
            v-model="exportAll"
            v-if="exportPanelParams.exportAll && !exportPanelParams.multiExport"
          >
            {{ $t('exportAll') }}
          </Checkbox>
        </div>
        <button class="modal-default-button btn btn-danger btn-sm" @click.stop="closeExportChoice">
          {{ $t('cancel') }}
        </button>
      </div>
    </Modal>
  </Fragment>
</template>

<script>
import Modal from '@/components/Modal';
import { Fragment } from 'vue-fragment';
import { mapState, mapMutations } from 'vuex';
import { getBaseURL } from '@/utils.js';
import sortBy from 'lodash.sortby';
import Checkbox from '@/components/ui/Checkbox.vue';
import Toggle from '@/components/ui/UiToggle2';
import { mapGetters } from 'vuex';

export default {
  components: {
    Modal,
    Fragment,
    Checkbox,
    Toggle,
  },

  mounted() {
    if (this.havePermission('getVision', 'read')) {
      this.exportTypes.push({
        id: 'LAST_USAGE',
        label: 'exportTable.lastUsage',
        permission: true,
      });
    }
    if (this.havePermission('getParc', 'export_service')) {
      this.exportTypes.push({
        id: 'SERVICES',
        label: 'exportTable.services',
        permission: true,
      });
    }
  },
  computed: {
    ...mapGetters(['havePermission']),
    ...mapGetters('actLines', ['appliedFilters']),
    ...mapState({
      isExportFormatChoiceOpen: state => state.ui.isExportFormatChoiceOpen,
      exportPanelParams: state => state.ui.exportPanelParams,
    }),
  },
  data() {
    return {
      isAsyncExportAlertOpen: false,
      errors: undefined,
      isLoading: false,
      exportFormat: undefined,
      exportAll: false,
      exportChoice: undefined,
      showLoader: false,
      haveError: false,
      forceAsyncExport: false,
      exportTypes: [
        {
          id: 'CLASSIC',
          label: 'exportTable.classic',
          default: true,
          permission: true,
        },
        {
          id: 'FULL',
          label: 'exportTable.complete',
          permission: true,
        },
      ],
      canShowInProgressExportChoice: false,
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
      }
    },
    appliedFilters(newFilters) {
      const found = newFilters.find(a => a.id === 'filters.partners');
      if (found) {
        if (found.values.length === 1) {
          this.exportTypes = [
            {
              id: 'CLASSIC',
              label: 'exportTable.classic',
              default: true,
              permission: true,
            },
            {
              id: 'FULL',
              label: 'exportTable.complete',
              permission: true,
            },
          ];
          if (this.havePermission('getVision', 'read')) {
            this.exportTypes.push({
              id: 'LAST_USAGE',
              label: 'exportTable.lastUsage',
              permission: true,
            });
          }
          if (this.havePermission('getParc', 'export_service')) {
            this.exportTypes.push({
              id: 'SERVICES',
              label: 'exportTable.services',
              permission: true,
            });
          }
          this.exportTypes.push({
            id: 'IN_PROGRESS',
            label: 'exportTable.inProgress',
            permission: true,
          });
        } else {
          this.exportTypes = [
            {
              id: 'CLASSIC',
              label: 'exportTable.classic',
              default: true,
              permission: true,
            },
            {
              id: 'FULL',
              label: 'exportTable.complete',
              permission: true,
            },
          ];
          if (this.havePermission('getVision', 'read')) {
            this.exportTypes.push({
              id: 'LAST_USAGE',
              label: 'exportTable.lastUsage',
              permission: true,
            });
          }
          if (this.havePermission('getParc', 'export_service')) {
            this.exportTypes.push({
              id: 'SERVICES',
              label: 'exportTable.services',
              permission: true,
            });
          }
        }
      }
      return this.exportTypes;
    },
  },
  methods: {
    ...mapMutations([
      'closeExportChoice',
      'flashMessage',
      'closeAndResetExportChoice',
      'startDownload',
    ]),

    async validateExport() {
      this.isAsyncExportAlertOpen = false;
      const downloadResponse = await this.doExport(
        this.exportFormat,
        true,
        this.exportAll,
        this.exportChoice
      );
      this.closeAndResetExportChoice();

      if (!downloadResponse || downloadResponse.errors) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }
    },

    async doExport(exportFormat, asyncExportRequest, exportAll, exportChoice) {
      const { columns, exportFn, orderBy, forceAsyncExport } = this.exportPanelParams;
      this.errors = undefined;
      const columnsParam = sortBy(columns, c => !c.visible)
        .filter(c => c.exportId)
        .map(c => c.exportId);

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

    async exportFile(exportFormat) {
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
            if (downloadResponse && downloadResponse.downloadUri) {
              this.startDownload(getBaseURL() + downloadResponse.downloadUri);
            }
            this.closeAndResetExportChoice();
          }
        } catch (err) {
          console.log(err);
          this.haveError = true;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>
