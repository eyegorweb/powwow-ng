<template>
  <div>
    <SimpleMultiSelect
      :options="options"
      :values="selectedValues"
      @updateValues="$emit('change', $event)"
    />
  </div>
</template>

<script>
import SimpleMultiSelect from '@/components/Filters/SimpleMultiSelect';

export default {
  components: {
    SimpleMultiSelect,
  },
  props: {
    selectedData: Array,
  },
  computed: {
    selectedValues() {
      if (this.selectedData) {
        return this.selectedData;
      }
      return [];
    },
  },
  data() {
    return {
      options: [
        {
          label: 'Valeur 1',
          id: 'value1',
        },
        {
          label: 'Valeur 2',
          id: 'value2',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
