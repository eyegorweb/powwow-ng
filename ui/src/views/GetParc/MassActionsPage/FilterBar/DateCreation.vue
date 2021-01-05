<template>
  <div>
    <RangeAndSingleDateFilter
      @change="setActDateCreationFilter"
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
    ...mapMutations('actHistory', ['setActDateCreationFilter']),
  },

  computed: {
    ...mapGetters('actHistory', ['selectedActDateCreation']),
    startDate() {
      return get(this.selectedActDateCreation, 'startDate', '');
    },
    endDate() {
      return get(this.selectedActDateCreation, 'endDate', '');
    },
  },
};
</script>

<style scoped></style>
