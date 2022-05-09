<template>
  <div>
    <FileSelect
      v-model="selectedFile"
      :disabled="!idType"
      :is-loading="isLoading"
      :placeholder="placeholder"
    />
    <div v-if="fileResponse && !requestErrors && !isLoading">
      <ul class="list-unstyled m-0">
        <li>
          <i class="ic-Check-Icon mr-2 text-success" />
          {{ totalLinesFound }}
          {{
            totalLinesFound > 1
              ? $t('getparc.actLines.fileImport.foundLines')
              : $t('getparc.actLines.fileImport.foundLine')
          }}.
        </li>
        <li v-if="totalNotCompatible > 0">
          <i class="ic-Cross-Icon mr-2 text-danger" />
          {{ totalNotCompatible }}
          {{
            totalNotCompatible > 1
              ? $t('getparc.actLines.fileImport.notFoundLines')
              : $t('getparc.actLines.fileImport.notFoundLine')
          }}.
          <ul class="list-styled">
            <li v-for="e in fileMeta.errors" :key="e.message">
              {{ e.message }}
            </li>
          </ul>
        </li>
        <li v-if="totalNotCompatible > 0">
          <ExportButton :export-fn="getExportFn()" :columns="columns" :order-by="orderBy">
            <span slot="title">{{
              $t('getparc.actLines.export', { total: $formatLargeNumber(totalNotCompatible) })
            }}</span>
          </ExportButton>
        </li>
      </ul>
    </div>
    <div v-if="fileResponse && !!requestErrors && !isLoading">
      <ul class="list-unstyled m-0">
        <li class="item" v-for="e in fileResponse.errors" :key="e.key">
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
</template>

<script>
import FileSelect from '@/components/ui/FileSelect';
import { uploadSearchFile } from '@/api/linesActions';
import ExportButton from '@/components/ExportButton';
import { exportLinesFromFileFilter } from '@/api/linesActions';
import * as fileUtils from '@/utils/file.js';

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
      isLoading: false,
      fileResponse: undefined,
      placeholder: this.$t('filters.lines.fromFile.import-file'),
      localFileMeta: undefined,
      localError: undefined,
    };
  },
  computed: {
    selectedFile: {
      get() {
        return this.localFileMeta;
      },
      async set(newFile) {
        this.localFileMeta = newFile;
        if (newFile) {
          this.isLoading = true;
          this.localError = this.getLocalError(newFile);
          if (!this.localError) {
            this.fileResponse = await uploadSearchFile(newFile, this.idType);
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
    requestErrors() {
      if (!this.fileResponse) return false;
      return this.fileResponse.errors.find(
        (f) => f.key === 400 || f.key === 422 || f.key === 500 || f.error === 'unknown'
      );
    },
    totalLinesFound() {
      return this.$loGet(this.fileMeta, 'validated', 0);
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
          ['UPLOAD_CREATOR', 'UPLOAD_DATE', 'DATA', 'NEW_DATA', 'STATUS'],
          '',
          exportFormat,
          this.fileMeta.tempDataUuid
        );
      };
    },
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
  },
};
</script>

<style lang="scss" scoped>
ul.list-styled {
  list-style-type: disc;
  font-size: 0.8rem;
}
</style>
