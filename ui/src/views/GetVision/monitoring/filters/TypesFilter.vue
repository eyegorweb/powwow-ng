<template>
  <div class="pb-4">
    <UiSelect
      v-if="options"
      v-model="selectedOption"
      :placeholder="$t('type')"
      :options="options"
      block
    />
  </div>
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';
import { getSupervisionAlertFilters } from '@/api/supervision.js';

export default {
  components: {
    UiSelect,
  },
  props: {
    selectedData: Object,
    selectedFilters: Array,
  },
  async mounted() {
    const alertFilters = await getSupervisionAlertFilters();
    if (alertFilters) {
      this.options = alertFilters.types.map(s => {
        return {
          label: s.value,
          value: s.key,
        };
      });
    }
  },
  computed: {
    selectedOption: {
      get() {
        return this.selectedData ? this.selectedData.data.value : '';
      },
      set(value) {
        this.$emit(
          'change',
          this.options.find(o => o.value === value)
        );
      },
    },
  },
  data() {
    return {
      options: undefined,
    };
  },
};
</script>

<style lang="scss" scoped></style>
