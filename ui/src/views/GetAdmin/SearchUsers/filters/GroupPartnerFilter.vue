<template>
  <MultiSelectSearch :items="items" :default-selected-items.sync="selectedValues" />
</template>

<script>
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';
import { fetchPartnerGroups } from '@/api/users';

export default {
  components: {
    MultiSelectSearch,
  },
  props: {},
  data() {
    return {
      items: [],
    };
  },
  props: {
    selectedData: Object,
  },

  computed: {
    selectedValues: {
      get() {
        if (!this.selectedData) return [];

        return this.selectedData.values;
      },

      set(values) {
        this.$emit('change', values);
      },
    },
  },
  async mounted() {
    const response = await fetchPartnerGroups();
    if (response) {
      this.items = response.map(p => {
        return {
          id: p.id,
          label: p.name,
        };
      });
    }
  },
};
</script>

<style lang="scss" scoped></style>
