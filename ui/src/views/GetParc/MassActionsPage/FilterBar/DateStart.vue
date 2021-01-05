<template>
  <div>
    <RangeAndSingleDateFilter
      @change="setActDateStartFilter"
      :start="startDate"
      :end="endDate"
      one-year-limit
    />
  </div>
</template>

<script>
import RangeAndSingleDateFilter from '@/components/Filters/RangeAndSingleDateFilter.vue';

import { mapMutations, mapGetters } from 'vuex';
import get from 'lodash/get';

export default {
  components: {
    RangeAndSingleDateFilter,
  },
  methods: {
    ...mapMutations('actHistory', ['setActDateStartFilter']),
  },

  computed: {
    ...mapGetters('actHistory', ['selectedActDateStart']),
    startDate() {
      return get(this.selectedActDateStart, 'startDate', '');
    },
    endDate() {
      return get(this.selectedActDateStart, 'endDate', '');
    },
  },
};
</script>

<style scoped></style>
