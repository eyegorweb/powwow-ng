<template>
  <div>
    <UiDateRange @change="setDate" :start="startDate" :end="endDate" direction="up" />
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

  computed: {
    startDate() {
      if (!this.selectedData) return '';
      return this.selectedData.startDate;
    },

    endDate() {
      if (!this.selectedData) return '';
      return this.selectedData.startDate;
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
