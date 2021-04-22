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
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
      otherOptions: [
        {
          code: 'c7',
          label: 'EID',
          value: 'EID',
        },
      ],
=======
>>>>>>> Stashed changes
      otherOptions: [{
        code: 'c7',
        label: 'EID',
        value: 'EID',
      }],
<<<<<<< Updated upstream
=======
>>>>>>> feat: [2590] Ajout du filtre IP_FIXE + type d'import dans actLines
>>>>>>> Stashed changes
    };
  },
  components: {
    SearchLinesByFileImportFilter,
  },
  computed: {
    ...mapGetters('actLines', ['selectedFileImportValues']),
<<<<<<< HEAD
    ...mapGetters(['userInfos', 'userIsBO', 'userIsGroupPartner']),
=======
    ...mapGetters(['havePermission']),
>>>>>>> feat: [2590] Ajout du filtre IP_FIXE + type d'import dans actLines
    fileMeta() {
      if (this.selectedFileImportValues && this.selectedFileImportValues.length) {
        return this.selectedFileImportValues[0];
      }
      return null;
    },
  },

<<<<<<< Updated upstream
  async mounted () {
    const optionsPartner = await getPartyOptions(this.userInfos.id);
    console.log(this.userIsBO)
    if (((this.userIsPartner || this.userIsGroupPartner) && optionsPartner.ipFixeEnable) || this.userIsBO) {
      this.otherOptions = [...this.otherOptions, {
        code: 'c8',
        label: 'IP_FIXE',
        value: 'IP_FIXE',
      }]
    };
=======
<<<<<<< HEAD
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
=======
  mounted () {
    if (!this.havePermission.userIsPartner) {
      console.log('relo')
    };
>>>>>>> feat: [2590] Ajout du filtre IP_FIXE + type d'import dans actLines
>>>>>>> Stashed changes
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
