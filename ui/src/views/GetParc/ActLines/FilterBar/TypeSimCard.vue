<template>
  <SimCardTypeFilter
    :selected-type-sim-card-values="selectedTypeSimCardValues"
    :selected-partners-values="selectedPartnersValues"
    :format-fn="formatItem"
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
    formatItem(item) {
      return {
        id: item.simCard.description,
        label: item.simCard.description,
      };
    },
  },
  computed: {
    ...mapGetters('actLines', ['selectedTypeSimCardValues', 'selectedPartnersValues']),
  },
};
</script>

<style lang="scss" scoped></style>
