<template>
  <div>
    <PartnersFilter :values="selectedValues" @updatePartners="onChange" />
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
  },

  methods: {
    onChange(partners) {
      this.$emit('change', partners);
    },
  },
};
</script>

<style scoped></style>
