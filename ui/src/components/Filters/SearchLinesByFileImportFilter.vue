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
      @response="$emit('setFilter', $event)"
    />
  </div>
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';
import ActLinesFileImport from '@/views/GetParc/ActLines/ActLinesFileImport';

export default {
  components: {
    UiSelect,
    ActLinesFileImport,
  },
  props: {
    fileMeta: Object,
    addOptions: Array,
  },

  watch: {
    selectedType() {
      if (this.fileMeta) {
        this.$emit('clear');
      }
    },
    // Si une options est ajouté pendant la durée de vie du composant, alors nous l'ajoutons au select
    addOptions(newValue) {
      this.options = [...this.initialOptions, ...newValue];
    },
  },

  mounted() {
    this.initialOptions = this.options;
    if (this.addOptions) {
      this.options = [...this.initialOptions, ...this.addOptions];
    }
  },
  data() {
    return {
      selectedType: null,
      initialOptions: undefined,
      options: [
        {
          code: 'c1',
          label: 'ICCID',
          value: 'SEARCH_ICCID',
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
