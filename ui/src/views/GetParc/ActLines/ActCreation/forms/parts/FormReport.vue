<template>
  <ul class="list-unstyled">
    <li>
      <i class="ic-Check-Icon mr-2 text-success" />
      {{ data.validated }}
      {{
        data.validated > 1
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
        <li v-for="e in data.errors" :key="e.message">
          {{ e.message }}
        </li>
      </ul>
    </li>
    <li v-if="totalNotCompatible > 0">
      <ExportButton :export-fn="getExportFn">
        <span slot="title">{{ $t('getparc.actLines.export', { total: totalNotCompatible }) }}</span>
      </ExportButton>
    </li>
  </ul>
</template>

<script>
import ExportButton from '@/components/ExportButton';

export default {
  components: {
    ExportButton,
  },

  props: {
    data: Object,
    getExportFn: Function,
  },

  computed: {
    totalNotCompatible() {
      if (!this.data.errors) {
        return 0;
      }
      return this.data.errors.reduce((total, e) => {
        return (total += e.number);
      }, 0);
    },
  },
};
</script>

<style lang="scss" scoped></style>
