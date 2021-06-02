<template>
  <MultiSelectSearch
    :items="items"
    :default-selected-items="selectedTypesValues"
    @update:defaultSelectedItems="(values) => $emit('change', values)"
  />
</template>

<script>
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';
import { getManagementActTypes } from '@/api/managementAct';

export default {
  components: {
    MultiSelectSearch,
  },
  props: {
    selectedData: Object,
    getPageContext: Function,
  },
  data() {
    return {
      items: [],
    };
  },
  async mounted() {
    const data = await getManagementActTypes();
    this.items = data.map((a) => ({ id: a.code, label: a.label }));
  },
  computed: {
    selectedTypesValues() {
      if (!this.selectedData) {
        return [];
      }
      return this.selectedData.values;
    },
  },
};
</script>

<style scoped></style>
