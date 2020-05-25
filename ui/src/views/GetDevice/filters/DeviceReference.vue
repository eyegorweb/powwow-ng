<template>
  <SimpleMultiSelect
    :options="localItems"
    :values="selectedValue || []"
    @updateValues="onUpdateValue"
  />
</template>

<script>
import SimpleMultiSelect from '@/components/Filters/SimpleMultiSelect';
import { getManufacturers } from '@/api/manufacturers.js';

export default {
  components: {
    SimpleMultiSelect,
  },
  data() {
    return {
      localItems: [],
    };
  },
  props: {
    selectedData: Object,
  },
  methods: {
    onUpdateValue(values) {
      this.$emit('change', values);
    },
  },

  computed: {
    selectedValue() {
      return this.selectedData && this.selectedData.values;
    },
  },

  async mounted() {
    const data = await getManufacturers();
    this.localItems = data.map(p => ({
      id: p.marketingName,
      label: p.marketingName,
      data: p,
    }));
  },
};
</script>

<style lang="scss" scoped></style>
