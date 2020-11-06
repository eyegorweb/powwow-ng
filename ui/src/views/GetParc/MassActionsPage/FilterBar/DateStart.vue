<template>
  <div>
    <UiDateRange
      :key="'startdate_' + version"
      @change="checkAndSetDate"
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
  methods: {
    ...mapMutations('actHistory', ['setActDateStartFilter']),
    ...mapMutations(['popupMessage']),

    checkAndSetDate(value) {
      console.log('checkAndSetDate -> value', value);
      // difference entre les deux dates
      // si > 12
      // this.popupMessage('HOP HOP HOP')
      this.setActDateStartFilter(value);
    },
  },
  computed: {
    ...mapGetters('actHistory', ['selectedActDateStart']),
    startDate() {
      return get(this.selectedActDateStart, 'startDate', '');
    },
    endDate() {
      return get(this.selectedActDateStart, 'endDate', '');
    },
    isDateEmpty() {
      return this.startDate === '' && this.endDate === '';
    },
  },
};
</script>

<style scoped></style>
