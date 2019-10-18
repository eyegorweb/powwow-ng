<template>
  <div>
    <FileSelect v-model="selectedFile" :disabled="!idType" />
    <div v-if="fileMeta && !error">
      <ul class="list-unstyled m-0">
        <li>
          <i class="ic-Check-Icon mr-2 text-success" />
          {{ fileMeta.validated }}
          {{ $t('getparc.actLines.fileImport.foundLines') }}.
        </li>
        <li v-if="totalNotCompatible > 0">
          <i class="ic-Cross-Icon mr-2 text-danger" />
          {{ totalNotCompatible }}
          {{ $t('getparc.actLines.fileImport.notFoundLines') }}.
          <ul class="list-styled">
            <li v-for="e in fileMeta.errors" :key="e.key">
              {{
                $t('getparc.actLines.fileImport.errors.' + e.key, {
                  count: e.number,
                  idType: idType,
                })
              }}
            </li>
          </ul>
        </li>
        <li v-if="totalNotCompatible > 0">
          <ExportButton :export-fn="getExportFn()" :columns="columns" :order-by="orderBy">
            <span slot="title">
              {{ $t('getparc.actLines.export', { total: totalNotCompatible }) }}
            </span>
          </ExportButton>
        </li>
      </ul>
    </div>
    <div v-if="error" class="alert alert-danger" role="alert">{{ fileMeta.error }}</div>
  </div>
</template>

<script>
import FileSelect from '@/components/ui/FileSelect';
import { uploadSearchFile } from '@/api/linesActions';
import ExportButton from '@/components/ExportButton';
import { exportLinesFromFileFilter } from '@/api/linesActions';

export default {
  components: {
    FileSelect,
    ExportButton,
  },
  props: {
    idType: String,
    fileMeta: Object,
  },
  data() {
    return {
      columns: [],
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      lastSelectedFile: null,
      // lastSelectedFileResponse: null,
    };
  },
  computed: {
    error() {
      if (!this.fileMeta) return false;
      return this.fileMeta.error;
    },
    selectedFile: {
      get() {
        if (!this.fileMeta) return null;
        return this.fileMeta.file;
      },
      async set(lastSelectedFile) {
        if (lastSelectedFile) {
          this.lastSelectedFileResponse = await uploadSearchFile(lastSelectedFile, this.idType);
          this.$emit('response', {
            // fileName: this.lastSelectedFile.name,
            file: lastSelectedFile,
            ...this.lastSelectedFileResponse,
          });
        }
      },
    },
    totalNotCompatible() {
      if (!this.fileMeta.errors) {
        return 0;
      }
      return this.fileMeta.errors.reduce((total, e) => {
        return (total += e.number);
      }, 0);
    },
  },
  methods: {
    getExportFn() {
      return async (columnsParam, orderBy, exportFormat) => {
        return await exportLinesFromFileFilter(
          [
            'UPLOAD_ID',
            'UPLOAD_CREATOR',
            'UPLOAD_DATE',
            'UPLOAD_TYPE',
            'DATA',
            'NEW_DATA',
            'STATUS',
          ],
          '',
          exportFormat,
          this.fileMeta.tempDataUuid
        );
      };
    },
  },
};
</script>

<style lang="scss" scoped>
ul.list-styled {
  list-style-type: disc;
  font-size: 0.8rem;
}
</style>
