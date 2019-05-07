<template>
  <div>
    <UiDateRange @change="setOrderDateFilter" :start="startDate" :end="endDate" />
  </div>
</template>

<script>
import UiDateRange from '@/components/ui/UiDateRange';
import { mapMutations, mapGetters } from 'vuex';
import get from 'lodash/get';

export default {
  components: {
    UiDateRange,
  },
  methods: {
    ...mapMutations('getsim', ['setOrderDateFilter']),
  },
  computed: {
    ...mapGetters('getsim', ['selectedOrderDate']),
    startDate() {
      return get(this.selectedOrderDate, 'startDate', '');
    },
    endDate() {
      return get(this.selectedOrderDate, 'endDate', '');
    },
  },
};
</script>

<style scoped></style>
