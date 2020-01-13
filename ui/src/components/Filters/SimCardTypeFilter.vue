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
import { mapGetters } from 'vuex';

export default {
  components: {
    MultiSelectSearch,
  },
  data() {
    return {
      items: [],
      orderBy: {
        key: 'label',
        direction: 'DESC',
      },
      filters: [
        {
          id: 'filters.lines.typeSIMCard',
          values: [],
        },
      ],
    };
  },
  props: {
    selectedTypeSimCardValues: Array,
  },
  computed: {
    ...mapGetters('actLines', ['appliedFilters']),
  },
  async mounted() {
    const data = await fetchCardTypes(this.orderBy, this.filters);
    this.items = data.map(i => {
      console.log('i', i);
      return {
        id: i.simCard.id,
        label: i.simCard.label,
      };
    });
    console.log('items', this.items);
  },
  methods: {
    setFilterValues(values) {
      console.log('set values', values);
      this.$emit('setTypeSimCardFilter', values);
    },
  },
};
</script>

<style lang="scss" scoped></style>
