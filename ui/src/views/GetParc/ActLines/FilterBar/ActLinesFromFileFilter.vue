<template>
  <div>
    <UiSelect
      class="pb-3 d-block"
      v-model="selectedType"
      :options="options"
      :placeholder="$t('filters.lines.fromFile.id-type-placeholder')"
      :arrow-blue="true"
    />
    <ActLinesFileImport
      :id-type="selectedType"
      :file-meta="fileMeta"
      @response="setFileImportFilter"
    />
  </div>
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';
import ActLinesFileImport from '@/views/GetParc/ActLines/ActLinesFileImport';
import { mapMutations, mapGetters } from 'vuex';

export default {
  components: {
    UiSelect,
    ActLinesFileImport,
  },
  computed: {
    ...mapGetters('actLines', ['selectedFileImportValues']),
    fileMeta() {
      if (this.selectedFileImportValues && this.selectedFileImportValues.length) {
        return this.selectedFileImportValues[0];
      }
      return null;
    },
  },

  methods: {
    ...mapMutations('actLines', ['setFileImportFilter']),
  },

  data() {
    return {
      selectedType: null,
      options: [
        {
          code: 'c1',
          label: 'ICCID',
          value: 'ICCID',
        },
        {
          code: 'msc2isdn',
          label: 'MSISDN',
          value: 'MSISDN',
        },
        {
          code: 'c3',
          label: 'AMSISDN',
          value: 'AMSISDN',
        },
        {
          code: 'c4',
          label: 'IMSI',
          value: 'IMSI',
        },
        {
          code: 'c5',
          label: 'IMEI',
          value: 'IMEI',
        },
      ],
    };
  },
};
</script>

<style scoped></style>
