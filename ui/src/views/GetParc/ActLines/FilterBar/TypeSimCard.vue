<template>
  <SimCardTypeFilter
    :selected-type-sim-card-values="selectedTypeSimCardValues"
    @setTypeSimCardFilter="setTypeSimCardFilter"
  />
</template>

<script>
import SimCardTypeFilter from '@/components/Filters/SimCardTypeFilter';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    SimCardTypeFilter,
  },

  methods: {
    ...mapMutations('actLines', ['setTypeSimCardFilter']),
  },
  computed: {
    ...mapGetters('actLines', ['selectedTypeSimCardValues']),
  },
};
</script>

<style lang="scss" scoped></style>
