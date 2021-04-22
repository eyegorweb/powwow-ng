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
import { getPartyOptions } from '@/api/partners.js';

export default {
  data() {
    return {
      otherOptions: [
        {
          code: 'c7',
          label: 'EID',
          value: 'EID',
        },
      ],
    };
  },
  components: {
    SearchLinesByFileImportFilter,
  },
  computed: {
    ...mapGetters('actLines', ['selectedFileImportValues']),
    ...mapGetters(['userInfos', 'userIsBO', 'userIsGroupPartner']),
    fileMeta() {
      if (this.selectedFileImportValues && this.selectedFileImportValues.length) {
        return this.selectedFileImportValues[0];
      }
      return null;
    },
  },

  async mounted() {
    const optionsPartner = await getPartyOptions(this.userInfos.id);
    console.log(this.userIsBO);
    if (
      ((this.userIsPartner || this.userIsGroupPartner) && optionsPartner.ipFixeEnable) ||
      this.userIsBO
    ) {
      this.otherOptions = [
        ...this.otherOptions,
        {
          code: 'c8',
          label: 'IP_FIXE',
          value: 'IP_FIXE',
        },
      ];
    }
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
