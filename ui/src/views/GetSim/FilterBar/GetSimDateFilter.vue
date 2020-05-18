<template>
  <div>
    <UiDateRange
      :key="'simdate_' + version"
      @change="setOrderDateFilter"
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
    ...mapMutations('getsim', ['setOrderDateFilter']),
  },
  data() {
    return {
      version: 0,
    };
  },
  computed: {
    ...mapGetters('getsim', ['selectedOrderDate']),
    startDate() {
      return get(this.selectedOrderDate, 'startDate', '');
    },
    endDate() {
      return get(this.selectedOrderDate, 'endDate', '');
    },

    isDateEmpty() {
      return this.startDate === '' && this.endDate === '';
    },
  },

  watch: {
    isDateEmpty() {
      this.version++;
    },
  },
};
</script>

<style scoped></style>
