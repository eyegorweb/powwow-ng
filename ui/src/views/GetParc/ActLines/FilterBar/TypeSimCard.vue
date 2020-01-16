<template>
  <SimCardTypeFilter
    :selected-type-sim-card-values="selectedTypeSimCardValues"
    :selected-partners-values="selectedPartnersValues"
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
    ...mapGetters('actLines', ['selectedTypeSimCardValues', 'selectedPartnersValues']),
  },
};
</script>

<style lang="scss" scoped></style>
