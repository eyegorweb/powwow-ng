<template>
  <div>
    <UiDateRange @change="setOrderDateFilter" :start="startDate" :end="endDate" />
  </div>
</template>

<script>
import UiDateRange from '@/components/ui/UiDateRange';
import { mapMutations, mapGetters } from 'vuex';

export default {
  components: {
    UiDateRange,
  },
  methods: {
    ...mapMutations(['setOrderDateFilter']),
  },
  computed: {
    ...mapGetters(['selectedOrderDate']),
    startDate() {
      if (this.selectedOrderDate) return this.selectedOrderDate.startDate;
    },
    endDate() {
      if (this.selectedOrderDate) return this.selectedOrderDate.endDate;
    },
  },
};
</script>

<style scoped>
</style>
