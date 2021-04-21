<template>
  <SearchLinesByFileImportFilter
    :file-meta="fileMeta"
    @clear="onClear"
    @setFilter="onSetFilter"
    :add-options="otherOptions"
  />
</template>

<script>
import SearchLinesByFileImportFilter from '@/components/Filters/SearchLinesByFileImportFilter.vue';
import { mapMutations, mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      otherOptions: [{
        code: 'c7',
        label: 'EID',
        value: 'EID',
      }],
    };
  },
  components: {
    SearchLinesByFileImportFilter,
  },
  computed: {
    ...mapGetters('actLines', ['selectedFileImportValues']),
    ...mapGetters(['havePermission']),
    fileMeta() {
      if (this.selectedFileImportValues && this.selectedFileImportValues.length) {
        return this.selectedFileImportValues[0];
      }
      return null;
    },
  },

  mounted () {
    if (!this.havePermission.userIsPartner) {
      console.log('relo')
    };
  },
  methods: {
    ...mapMutations('actLines', ['setFileImportFilter']),
    ...mapActions('actLines', ['clearFilter']),

    onClear() {
      this.clearFilter('filters.lines.fromFile.title');
    },

    onSetFilter(value) {
      this.setFileImportFilter(value);
    },
  },
};
</script>

<style scoped></style>
