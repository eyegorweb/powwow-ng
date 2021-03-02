<template>
  <div>
    <button :class="className" @click.stop="chooseExportFormat">
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
    exportFn: Function,
    onErrorFn: Function,
    exportAll: Boolean,
    forceAsyncExport: Boolean,
    buttonStyle: Boolean,
    multiExport: Boolean,
    btnClassName: {
      type: String,
      required: false,
    },
  },
  methods: {
    ...mapMutations(['openExportChoice']),

    chooseExportFormat() {
      this.openExportChoice({
        columns: this.columns,
        orderBy: this.orderBy,
        exportFn: this.exportFn,
        onErrorFn: this.onErrorFn,
        exportAll: this.exportAll,
        forceAsyncExport: this.forceAsyncExport,
        multiExport: this.multiExport,
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
