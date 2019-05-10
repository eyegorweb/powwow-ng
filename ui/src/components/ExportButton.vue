<template>
  <div>
    <button class="btn btn-link export-link" @click="chooseExportFormat">
      <i class="ic-Download-Icon" />
      <slot name="title">
        Exporter
      </slot>
    </button>
    <Modal v-if="isAsyncExportAlertOpen">
      <p slot="body">
        {{ $t('getsim.export-warning') }}
      </p>
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
            <button class="btn btn-link export-button" @click.stop="exportFile('CSV')">
              <img src="@/assets/csv.svg" alt="csv" />
              <span>CSV</span>
            </button>
          </div>
          <div class="col text-center">
            <button class="btn btn-link export-button" @click.stop="exportFile('EXCEL')">
              <img src="@/assets/excel.svg" alt="excel" />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>
      <div slot="footer">
        <button
          class="modal-default-button btn btn-danger btn-sm"
          @click.stop="isExportFormatChoiceOpen = false"
        >
          {{ $t('cancel') }}
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal';
import sortBy from 'lodash.sortby';

export default {
  components: {
    Modal,
  },
  props: {
    columns: Array,
    orderBy: Object,
    exportFn: Function,
  },
  methods: {
    async exportFile(exportFormat) {
      const columnsParam = sortBy(this.columns, c => !c.visible)
        .filter(c => c.exportId)
        .map(c => c.exportId);
      const downloadResponse = await this.exportFn(columnsParam, this.orderBy, exportFormat);
      if (downloadResponse.asyncRequired) {
        this.isExportFormatChoiceOpen = false;
        setTimeout(() => {
          this.isAsyncExportAlertOpen = true;
        }, 200);
      } else {
        if (downloadResponse && downloadResponse.downloadUri) {
          window.open(downloadResponse.downloadUri, '_blank');
        }
        this.isExportFormatChoiceOpen = false;
      }
    },
    chooseExportFormat() {
      this.isExportFormatChoiceOpen = true;
    },
  },
  data() {
    return {
      isAsyncExportAlertOpen: false,
      isExportFormatChoiceOpen: false,
    };
  },
};
</script>

<style lang="scss" scoped></style>
