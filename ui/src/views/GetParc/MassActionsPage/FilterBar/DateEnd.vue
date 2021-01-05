<template>
  <div>
    <RangeAndSingleDateFilter
      @change="setActDateEndFilter"
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
    ...mapMutations('actHistory', ['setActDateEndFilter']),
  },

  computed: {
    ...mapGetters('actHistory', ['selectedActDateEnd']),
    startDate() {
      return get(this.selectedActDateEnd, 'startDate', '');
    },
    endDate() {
      return get(this.selectedActDateEnd, 'endDate', '');
    },
  },
};
</script>

<style scoped></style>
