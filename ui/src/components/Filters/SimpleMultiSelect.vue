<template>
  <MultiSelectSearch
    :items="options"
    :default-selected-items.sync="selectedItems"
    :disabled-items="disabledItems"
  />
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
    disabledItems: {
      type: Array,
      required: false,
    },

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
