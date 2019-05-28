<template>
  <MultiSelectSearch :items="options" :default-selected-items.sync="selectedItems" />
</template>

<script>
/**
 * Simple multi select filter with provided options ( no asyc searches )
 */
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';

export default {
  name: 'ActLinesSimStatuses',
  components: {
    MultiSelectSearch,
  },
  props: {
    values: Array,

    /**
     * should respect the format :
     * {
     *  id: 'someId',
     *  label: 'someLabel'
     * }
     */
    options: Array,
  },
  computed: {
    selectedItems: {
      get() {
        return this.values;
      },
      set(newValues) {
        this.$emit('updateValues', newValues);
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
