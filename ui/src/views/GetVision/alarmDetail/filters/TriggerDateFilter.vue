<template>
  <div>
    <UiDateRange
      :key="'triggerdate_' + version"
      @change="setDate"
      :start="startDate"
      :end="endDate"
      direction="up"
    />
  </div>
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
  watch: {
    isDateEmpty() {
      this.version++;
    },
  },

  computed: {
    startDate() {
      if (!this.selectedData) return '';
      return this.selectedData.startDate;
    },

    endDate() {
      if (!this.selectedData) return '';
      return this.selectedData.startDate;
    },

    isDateEmpty() {
      return this.startDate === '' && this.endDate === '';
    },
  },
  methods: {
    setDate(value) {
      this.$emit('change', value);
    },
  },
};
</script>

<style lang="scss" scoped></style>
