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
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    MultiSelectSearch,
  },
  data() {
    return {
      items: [],
    };
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
    ...mapMutations('actLines', ['setTypeSimCardFilter']),
    setFilterValues(values) {
      this.setTypeSimCardFilter(values);
    },
  },
  computed: {
    ...mapGetters('actLines', ['selectedTypeSimCardValues']),
  },
};
</script>

<style lang="scss" scoped></style>
