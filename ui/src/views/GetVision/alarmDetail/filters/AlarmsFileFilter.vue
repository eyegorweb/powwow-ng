<template>
  <div>
    <SearchLinesByFileImportFilter
      :key="'filefilter_' + version"
      :file-meta="fileMeta"
      @clear="onClear"
      @setFilter="onSetFilter"
    />
  </div>
</template>

<script>
import SearchLinesByFileImportFilter from '@/components/Filters/SearchLinesByFileImportFilter.vue';

export default {
  components: {
    SearchLinesByFileImportFilter,
  },

  props: {
    selectedData: Object,
  },

  watch: {
    selectedData(newValue) {
      if (!newValue) {
        this.version += 1;
      }
    },
  },

  data() {
    return {
      version: 0,
      files: undefined,
    };
  },

  computed: {
    fileMeta() {
      if (this.selectedData && this.selectedData.values && this.selectedData.values.length) {
        return this.selectedData.values[0];
      }
      return null;
    },
  },

  methods: {
    onClear() {
      this.$emit('clear', 'filters.lines.fromFile.title');
    },

    onSetFilter(value) {
      this.$emit('change', value);
    },
  },
};
</script>

<style lang="scss" scoped></style>
