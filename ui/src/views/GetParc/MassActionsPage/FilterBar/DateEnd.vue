<template>
  <div>
    <UiDateRange @change="setActDateEndFilter" :start="startDate" :end="endDate" />
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
