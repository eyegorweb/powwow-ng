<template>
  <div>
    <RangeAndSingleDateFilter
      @change="$emit('change', $event)"
      :start="startDate"
      :end="endDate"
      one-year-limit
    />
  </div>
</template>

<script>
import RangeAndSingleDateFilter from '@/components/Filters/RangeAndSingleDateFilter.vue';

export default {
  components: {
    RangeAndSingleDateFilter,
  },
  props: {
    selectedData: Object,
    getPageContext: Function,
  },

  computed: {
    startDate() {
      if (this.selectedData) {
        return this.selectedData.startDate;
      }
      return '';
    },
    endDate() {
      if (this.selectedData) {
        return this.selectedData.endDate;
      }
      return '';
    },
  },
};
</script>

<style lang="scss" scoped></style>
