<template>
  <div>
    <UiDateRange2 @change="setOrderDateFilter" :start="startDate" :end="endDate" />
  </div>
</template>

<script>
import UiDateRange2 from '@/components/ui/UiDateRange2';
import { mapMutations, mapGetters } from 'vuex';

export default {
  components: {
    UiDateRange2,
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
