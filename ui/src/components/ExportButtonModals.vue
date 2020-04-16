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
          @click.stop="isAsyncExportAlertOpen = false"
        >
          {{ $t('export') }}
        </button>
      </div>
    </Modal>
    <Modal v-if="isExportFormatChoiceOpen">
      <div slot="body">
        <h4>Veuillez choisir un format d'export :</h4>
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
        <div v-if="errors">
          <h6 class="text-danger">{{ $t('exportError') }}</h6>
        </div>
      </div>
      <div slot="footer">
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
import sortBy from 'lodash.sortby';

export default {
  components: {
    Modal,
    Fragment,
  },
  computed: {
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
    };
  },
  methods: {
    ...mapMutations(['closeExportChoice']),
    async exportFile(exportFormat) {
      const { columns, exportFn, orderBy } = this.exportPanelParams;
      this.errors = undefined;
      const columnsParam = sortBy(columns, c => !c.visible)
        .filter(c => c.exportId)
        .map(c => c.exportId);

      this.isLoading = true;
      const downloadResponse = await exportFn(columnsParam, orderBy, exportFormat);
      this.isLoading = false;

      if (downloadResponse.errors) {
        this.errors = downloadResponse.errors;
        return;
      }
      if (downloadResponse.asyncRequired) {
        this.closeExportChoice();
        setTimeout(() => {
          this.isAsyncExportAlertOpen = true;
        }, 200);
      } else {
        if (downloadResponse && downloadResponse.downloadUri) {
          window.open(downloadResponse.downloadUri, '_blank');
        }
        this.closeExportChoice();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
