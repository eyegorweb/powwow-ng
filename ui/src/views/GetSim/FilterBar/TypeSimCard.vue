<template>
  <SimCardTypeFilter
    :selected-type-sim-card-values="selectedTypeSimCardValues"
    :selected-partners-values="selectedPartnersValues"
    exclude-category="ESIM"
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
    ...mapMutations('getsim', ['setTypeSimCardFilter']),
  },
  computed: {
    ...mapGetters('getsim', ['selectedTypeSimCardValues', 'selectedPartnersValues']),
  },
};
</script>

<style lang="scss" scoped></style>
