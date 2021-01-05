<template>
  <div>
    <RangeAndSingleDateFilter @change="setDate" :start="startDate" :end="endDate" />
  </div>
</template>

<script>
import RangeAndSingleDateFilter from '@/components/Filters/RangeAndSingleDateFilter.vue';
import get from 'lodash/get';

export default {
  components: {
    RangeAndSingleDateFilter,
  },
  props: {
    ns: String,
    getter: String,
    setter: String,
    filterKey: String,
  },
  methods: {
    setDate(value) {
      this.$store.commit(`${this.ns}/${this.setter}`, { ...value, filterKey: this.filterKey });
    },
  },
  computed: {
    selectedDate() {
      return this.$store.getters[`${this.ns}/${this.getter}`](this.filterKey);
    },
    startDate() {
      return get(this.selectedDate, 'startDate', '');
    },
    endDate() {
      return get(this.selectedDate, 'endDate', '');
    },
  },
};
</script>

<style scoped></style>
