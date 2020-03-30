<template>
  <MultiSelectSearch :items="items" :default-selected-items.sync="selectedItems" />
</template>

<script>
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';
import { fetchPartnerGroups } from '@/api/partners';

export default {
  components: {
    MultiSelectSearch,
  },

  props: {},

  data() {
    return {
      items: [],
      selectedItems: [],
    };
  },

  mounted() {
    (async () => {
      const response = await fetchPartnerGroups();
      if (response) {
        this.items = response.map(p => {
          return {
            id: p.id,
            label: p.name,
          };
        });
      }
    })();
  },

  watch: {
    selectedItems(newValue) {
      this.$emit('change', newValue);
    },
  },
};
</script>

<style lang="scss" scoped></style>
