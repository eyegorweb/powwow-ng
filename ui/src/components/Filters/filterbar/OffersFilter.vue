<template>
  <div>
    <OffersFilter
      :selected-offers-values="selectedValues"
      :selected-partners-values="partnerIds"
      @setOffersFilter="values => $emit('change', values)"
    />
  </div>
</template>

<script>
import OffersFilter from '@/components/Filters/OffersFilter';

export default {
  components: {
    OffersFilter,
  },
  props: {
    selectedData: Object,
    getPageContext: Function,
  },
  computed: {
    selectedValues() {
      if (!this.selectedData) return [];

      return this.selectedData.values;
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
