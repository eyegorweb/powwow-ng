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
  props: {},
  data() {
    return {
      items: [],
      selectedItems: [],
    };
  },
  async mounted() {
    const response = await fetchUserRoles();

    if (response) {
      this.items = response.map(r => {
        return {
          id: r.name,
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
  },
};
</script>

<style lang="scss" scoped></style>
