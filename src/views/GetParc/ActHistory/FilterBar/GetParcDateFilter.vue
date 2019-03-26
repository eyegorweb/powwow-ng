<template>
  <div>
    <UiDateRange @change="setActDateFilter" :start="startDate" :end="endDate" />
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
    ...mapMutations('actHistory', ['setActDateFilter']),
  },
  computed: {
    ...mapGetters('actHistory', ['selectedActDate']),
    startDate() {
      return get(this.selectedActDate, 'startDate', '');
    },
    endDate() {
      return get(this.selectedActDate, 'endDate', '');
    },
  },
};
</script>

<style scoped></style>
