<template>
  <div>
    <PartnersFilter :values="selectedValues" @updatePartners="onChange" :category="category" />
  </div>
</template>

<script>
import PartnersFilter from '@/components/Filters/PartnersFilter';

export default {
  components: {
    PartnersFilter,
  },

  props: {
    selectedData: Object,
    getPageContext: Function,
  },
  data() {
    return {
      testv: [],
    };
  },

  computed: {
    selectedValues() {
      if (!this.selectedData) return [];

      return this.selectedData.values;
    },

    category() {
      if (!this.getPageContext) return undefined;
      const pageContext = this.getPageContext();
      if (pageContext && pageContext.category) {
        return pageContext.category;
      }

      return undefined;
    },
  },

  methods: {
    onChange(partners) {
      this.$emit('change', partners);
    },
  },
};
</script>

<style scoped></style>
