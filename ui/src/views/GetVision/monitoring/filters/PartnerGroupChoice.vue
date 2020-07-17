<template>
  <div class="pb-4">
    <UiSelect
      v-model="selectedOption"
      placeholder="Aucun"
      :options="options"
      :disabled="!!partner"
    />
  </div>
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';

export default {
  components: {
    UiSelect,
  },
  props: {
    selectedData: Object,
    selectedFilters: Array,
  },
  computed: {
    partner() {
      const partner = this.selectedFilters.find(f => f.id === 'getadmin.users.filters.partners');
      return partner;
    },
    selectedOption: {
      get() {
        return this.selectedData ? this.selectedData.data.value : '';
      },
      set(value) {
        this.$emit('change', this.options.find(o => o.value === value));
      },
    },
  },
  data() {
    return {
      options: [
        {
          label: ' M2M Automobile & télématique',
          value: 'M2M_AUTOMOTIVE',
        },
        {
          label: ' M2M Utilities, sécurité & monétique',
          value: 'M2M_UTILITIES',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
