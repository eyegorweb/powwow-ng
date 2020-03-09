<template>
  <div>
    <UiDateRange
      :key="'createdate_' + version"
      @change="setActDateCreationFilter"
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
    ...mapMutations('actHistory', ['setActDateCreationFilter']),
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
    ...mapGetters('actHistory', ['selectedActDateCreation']),
    startDate() {
      return get(this.selectedActDateCreation, 'startDate', '');
    },
    endDate() {
      return get(this.selectedActDateCreation, 'endDate', '');
    },

    isDateEmpty() {
      return this.startDate === '' && this.endDate === '';
    },
  },
};
</script>

<style scoped></style>
