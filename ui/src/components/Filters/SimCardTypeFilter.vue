<template>
  <MultiSelectSearch
    :items="items"
    :default-selected-items="selectedTypeSimCardValues"
    @update:defaultSelectedItems="setFilterValues"
  />
</template>

<script>
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';
import { fetchCardTypes } from '@/api/linesActions';

export default {
  components: {
    MultiSelectSearch,
  },
  data() {
    return {
      items: [],
    };
  },
  props: {
    selectedTypeSimCardValues: Array,
  },
  async mounted() {
    const data = await fetchCardTypes();
    this.items = data.map(l => {
      return {
        id: l,
        label: l,
      };
    });
  },
  methods: {
    setFilterValues(values) {
      this.$emit('setTypeSimCardFilter', values);
    },
  },
};
</script>

<style lang="scss" scoped></style>
