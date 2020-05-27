<template>
  <SearchLinesByFileImportFilter :file-meta="fileMeta" @clear="onClear" @setFilter="onSetFilter" />
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
  data() {
    return {
      fileMeta: undefined,
    };
  },
  methods: {
    onClear() {},
    onSetFilter(value) {
      this.fileMeta = value;
      this.$emit('change', value);
    },
  },
};
</script>

<style lang="scss" scoped></style>
