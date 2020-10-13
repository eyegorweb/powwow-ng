<template>
  <MultiSelectSearch :items="items" :default-selected-items.sync="selectedItems" />
</template>

<script>
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';
import { fetchUserRoles } from '@/api/users';

export default {
  components: {
    MultiSelectSearch,
  },
  props: {
    selectedData: Object,
  },
  data() {
    return {
      items: [],
      selectedItems: [],
    };
  },
  async mounted() {
    if (this.selectedData && this.selectedData.id) {
      this.selectedItems = this.selectedData.values;
    }

    const response = await fetchUserRoles();

    if (response) {
      this.items = response.map(r => {
        return {
          id: r.name + r.Id,
          label: r.description,
          ...r,
        };
      });
    }
  },
  watch: {
    selectedItems(newValue) {
      this.$emit('change', newValue);
    },
    selectedData(selectedData) {
      if (!selectedData) {
        this.selectedItems = [];
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
