<template>
  <div>
    <UiDateRange @change="setActDateStartFilter" :start="startDate" :end="endDate" />
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
