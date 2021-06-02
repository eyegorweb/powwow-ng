<template>
  <SimpleMultiSelect
    :options="items"
    :values="selectedErrorValues"
    @updateValues="(values) => $emit('change', values)"
  />
</template>

<script>
import SimpleMultiSelect from '@/components/Filters/SimpleMultiSelect';
import { fetchErrorCodes } from '@/api/massActions';
import uuid from 'uuid/v1';

export default {
  components: {
    SimpleMultiSelect,
  },
  data() {
    return {
      items: [],
    };
  },
  props: {
    selectedData: Object,
    getPageContext: Function,
  },
  computed: {
    selectedErrorValues() {
      if (!this.selectedData) {
        return [];
      }
      return this.selectedData.values;
    },
  },
  methods: {
    async refreshList() {
      const data = await fetchErrorCodes();
      this.items = data.map((l) => {
        return {
          meta: l,
          id: uuid(),
          label: l.libelle,
          code: l.code,
          type: l.type,
        };
      });
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style lang="scss" scoped></style>
