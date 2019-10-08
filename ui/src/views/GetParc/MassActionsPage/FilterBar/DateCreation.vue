<template>
  <div>
    <UiDateRange @change="setActDateCreationFilter" :start="startDate" :end="endDate" />
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
