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
      orderBy: {
        key: 'manufacturer',
        direction: 'ASC',
      },
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
    const { pagination } = {
      pagination: { page: 0, limit: 30 },
    };
    const data = await getManufacturers(this.orderBy, pagination);
    if (!data) return;
    this.localItems = data.map(p => ({
      id: `${p.tac}`,
      label: p.manufacturer,
      data: p,
    }));
  },
};
</script>

<style lang="scss" scoped></style>
