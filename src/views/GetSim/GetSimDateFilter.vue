<template>
  <div>
    <UiDateRange @change="setOrderDateFilter" :start="startDate" :end="endDate" />
  </div>
</template>

<script>
import UiDateRange from '@/components/ui/UiDateRange';
import { mapMutations, mapGetters } from 'vuex';
import { get } from 'lodash-es';

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
      return get(this.selectedOrderDate, 'startDate', '');
    },
    endDate() {
      return get(this.selectedOrderDate, 'endDate', '');
    },
  },
};
</script>

<style scoped>
</style>
