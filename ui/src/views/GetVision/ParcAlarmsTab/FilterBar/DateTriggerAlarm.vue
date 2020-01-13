<template>
  <div>
    <UiDateRange @change="setAlarmDateFilter" :start="startDate" :end="endDate" />
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
    ...mapMutations('alarms', ['setAlarmDateFilter']),
  },
  computed: {
    ...mapGetters('alarms', ['selectedAlarmDateTrigger']),
    startDate() {
      return get(this.selectedAlarmDateTrigger, 'startDate', '');
    },
    endDate() {
      return get(this.selectedAlarmDateTrigger, 'endDate', '');
    },
  },
};
</script>

<style scoped></style>
