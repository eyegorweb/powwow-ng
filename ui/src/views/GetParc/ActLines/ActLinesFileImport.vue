<template>
  <div>
    <FileSelect
      v-model="selectedFile"
      :disabled="!idType"
      :is-loading="isLoading"
      :placeholder="placeholder"
    />
    <div v-if="fileMeta && !error && !isLoading">
      <ul class="list-unstyled m-0">
        <li>
          <i class="ic-Check-Icon mr-2 text-success" />
          {{ fileMeta.validated }}
          {{
            fileMeta.validated > 1
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
              $t('getparc.actLines.export', { total: totalNotCompatible })
            }}</span>
          </ExportButton>
        </li>
      </ul>
    </div>
    <div v-if="error && !isLoading" class="alert alert-danger" role="alert">
      <template v-if="isTranslatableUploadError">
        {{ $t('getparc.actCreation.report.' + fileMeta.error) }}
      </template>
      <template v-else>
        {{ $t('genericErrorMessage') }}
      </template>
    </div>
    <div v-if="localError && !isLoading" class="alert alert-danger" role="alert">
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
      lastSelectedFile: undefined,
      fileResponse: undefined,
      placeholder: this.$t('filters.lines.fromFile.import-file'),
      localFileMeta: undefined,
      localError: undefined,
    };
  },
  watch: {
    error() {
      if (fileUtils.checkFormat(this.selectedFile)) {
        this.fileMeta.error = 'DATA_INVALID_FORMAT';
      } else if (fileUtils.checkFileSize(this.selectedFile)) {
        this.fileMeta.error = 'FILE_SIZE_LIMIT_EXCEEDED';
      }
    },
  },
  computed: {
    isTranslatableUploadError() {
      return (
        [
          'InvalidFileExtension',
          'InvalidFileContent',
          'InvalidFileVersion',
          'NotFoundException',
          'InvalidFileSize',
        ].indexOf(this.fileMeta.error) > -1
      );
    },
    error: {
      get() {
        if (!this.fileMeta) return null;
        return this.fileMeta.error;
      },
    },
    selectedFile: {
      get() {
        return this.localFileMeta;
      },
      async set(lastSelectedFile) {
        this.localFileMeta = lastSelectedFile;
        if (lastSelectedFile) {
          this.isLoading = true;
          this.localError = this.getLocalError(lastSelectedFile);
          if (!this.localError) {
            this.fileResponse = await uploadSearchFile(lastSelectedFile, this.idType);
            if (
              this.fileResponse &&
              this.fileResponse.error &&
              this.wsUploadFileError(this.fileResponse.error)
            ) {
              const count =
                this.fileResponse.data && this.fileResponse.data.maxNumbersPerFileUpload
                  ? this.fileResponse.data.maxNumbersPerFileUpload
                  : '';
              this.localError = this.$t('getparc.actCreation.report.FILE_MAX_LINE_NUMBER_INVALID', {
                count,
              });
            } else {
              this.$emit('response', {
                file: lastSelectedFile,
                ...this.fileResponse,
              });
            }
          }
          this.isLoading = false;
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
    wsUploadFileError(error) {
      return !!error;
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
