<template>
  <div v-if="!isReady"></div>
  <SearchLinesByFileImportFilter
    v-else
    :file-meta="fileMeta"
    @clear="onClear"
    @setFilter="onSetFilter"
    :add-options="otherOptions"
  />
</template>

<script>
import SearchLinesByFileImportFilter from '@/components/Filters/SearchLinesByFileImportFilter.vue';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import { isFeatureAvailable } from '@/api/partners';

export default {
  data() {
    return {
      isReady: false,
      otherOptions: [],
    };
  },
  components: {
    SearchLinesByFileImportFilter,
  },
  computed: {
    ...mapGetters('actLines', ['selectedFileImportValues']),
    ...mapGetters([
      'userInfos',
      'userIsBO',
      'userIsGroupPartner',
      'userPartnerOptions',
      'userIsPartner',
    ]),
    ...mapGetters(['havePermission']),
    fileMeta() {
      if (this.selectedFileImportValues && this.selectedFileImportValues.length) {
        return this.selectedFileImportValues[0];
      }
      return null;
    },
  },

  async mounted() {
    let ipFixeEnabled = false;
    if (this.userIsPartner || this.userInfos.type === 'PARTNER_GROUP') {
      ipFixeEnabled = await isFeatureAvailable('IP_FIXE_ENABLED');
    }

    if(this.userInfos.esimEnabled) {
      this.otherOptions = [
        ...this.otherOptions,
        {
          code: 'c7',
          label: 'EID',
          value: 'EID',
        },
      ];
    }

    if (((this.userIsPartner || this.userIsGroupPartner) && ipFixeEnabled) || this.userIsBO) {
      this.otherOptions = [
        ...this.otherOptions,
        {
          code: 'c8',
          label: 'IP_FIXE',
          value: 'IP_FIXE',
        },
      ];
    }

    this.isReady = true;
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
