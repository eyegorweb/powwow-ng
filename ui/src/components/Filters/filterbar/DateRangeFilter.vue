<template>
  <div>
    <UiDateRange
      :key="'triggerdate_' + version"
      @change="setDate"
      :start="startDate"
      :end="endDate"
    />
  </div>
</template>

<script>
import UiDateRange from '@/components/ui/UiDateRange';
import get from 'lodash/get';

export default {
  components: {
    UiDateRange,
  },
  props: {
    selectedData: Object,
  },
  methods: {
    setDate(value) {
      this.$emit('change', value);
    },
  },
  data() {
    return {
      version: 0,
    };
  },
  watch: {
    isDateEmpty() {
      this.version++;
    },
  },
  computed: {
    startDate() {
      return get(this.selectedData, 'startDate', '');
    },
    endDate() {
      return get(this.selectedData, 'endDate', '');
    },
    isDateEmpty() {
      return this.startDate === '' && this.endDate === '';
    },
  },
};
</script>

<style scoped></style>
