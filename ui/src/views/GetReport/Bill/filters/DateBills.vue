<template>
  <UiDateRange
    :key="'triggerdate_' + version"
    @change="onChange"
    :start="startDate"
    :end="endDate"
  />
</template>

<script>
import UiDateRange from '@/components/ui/UiDateRange';

export default {
  components: {
    UiDateRange,
  },
  props: {
    selectedData: Object,
  },

  data() {
    return {
      version: 0,
    };
  },
  methods: {
    onChange(values) {
      console.log('Values >>', values);
      this.$emit('change', values);
    },
  },
  watch: {
    isDateEmpty() {
      this.version++;
    },
  },
  computed: {
    isDateEmpty() {
      return this.startDate === '' && this.endDate === '';
    },
    startDate() {
      if (this.selectedData) return this.selectedData.startDate;

      return undefined;
    },

    endDate() {
      if (this.selectedData) return this.selectedData.endDate;

      return undefined;
    },
  },
};
</script>

<style scoped></style>
