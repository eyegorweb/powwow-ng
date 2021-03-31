<template>
  <SimCardTypeFilter
    :selected-type-sim-card-values="selectedValues"
    :selected-partners-values="partnerIds"
    @setTypeSimCardFilter="$emit('change', $event)"
  />
</template>

<script>
import SimCardTypeFilter from '@/components/Filters/SimCardTypeFilter.vue';

export default {
  components: {
    SimCardTypeFilter,
  },

  props: {
    selectedData: Object,
    getPageContext: Function,
  },

  computed: {
    selectedValues() {
      if (this.selectedData) {
        return this.selectedData.values;
      }
      return [];
    },
    partnerIds() {
      if (!this.getPageContext) return [];
      const pageContext = this.getPageContext();
      if (pageContext && pageContext.partners) {
        return pageContext.partners;
      }

      return [];
    },
  },
};
</script>

<style lang="scss" scoped></style>
