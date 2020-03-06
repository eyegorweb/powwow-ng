<template>
  <div>
    <UiDateRange
      :key="'triggerdate_' + version"
      @change="setAlarmDateFilter"
      :start="startDate"
      :end="endDate"
    />
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
  data() {
    return {
      version: 0,
    };
  },
  watch: {
    isDateEmpty() {
      this.version++;
    },
  },
  computed: {
    ...mapGetters('alarms', ['selectedAlarmDateTrigger']),
    startDate() {
      return get(this.selectedAlarmDateTrigger, 'startDate', '');
    },
    endDate() {
      return get(this.selectedAlarmDateTrigger, 'endDate', '');
    },
    isDateEmpty() {
      return this.startDate === '' && this.endDate === '';
    },
  },
};
</script>

<style scoped></style>
