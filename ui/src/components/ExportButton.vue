<template>
  <div>
    <button :class="`export-file-button ${className}`" @click.stop="chooseExportFormat">
      <slot name="icon"> </slot>
      <slot name="title">{{ $t('export') }}</slot>
    </button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: {
    columns: {
      type: Array,
      required: false,
    },
    orderBy: {
      type: Object,
      required: false,
    },
    nbOfLines: Number,
    exportFn: Function,
    onErrorFn: Function,
    exportAll: Boolean,
    forceAsyncExport: Boolean,
    buttonStyle: Boolean,
    btnClassName: {
      type: String,
      required: false,
    },
    otherExportChoices: Array,
    exportChoices: Array,
    getExportChoiceDisabledMessage: {
      type: Function,
      required: false,
    },
    getExportTypeDisabledMessage: {
      type: Function,
      required: false,
    },
  },
  methods: {
    ...mapMutations(['openExportChoice']),

    chooseExportFormat() {
      this.openExportChoice({
        columns: this.columns,
        nbOfLines: this.nbOfLines,
        orderBy: this.orderBy,
        exportFn: this.exportFn,
        onErrorFn: this.onErrorFn,
        exportAll: this.exportAll,
        forceAsyncExport: this.forceAsyncExport,
        otherExportChoices: this.otherExportChoices,
        exportChoices: this.exportChoices,
        getExportChoiceDisabledMessage: this.getExportChoiceDisabledMessage,
        getExportTypeDisabledMessage: this.getExportTypeDisabledMessage,
      });
    },
  },
  computed: {
    className() {
      if (this.btnClassName) {
        return this.btnClassName;
      }

      if (this.buttonStyle) {
        return 'btn btn-accent btn-block';
      }
      return 'btn btn-link export-link';
    },
  },
  data() {
    return {
      errors: undefined,
      isLoading: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.btn-import {
  color: $primary;
  background: $white;
  border-color: $primary;
}
</style>
