<template>
  <CommunitiesFilter
    :selected-community-values="selectedCommunityValues"
    :selected-partners-values="selectedPartnersValues"
    @update:values="setCommunityFilter"
  />
</template>

<script>
import CommunitiesFilter from '@/components/Filters/CommunitiesFilter';
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'ActLinesYorkCommunityFilter',
  components: {
    CommunitiesFilter,
  },
  computed: {
    ...mapGetters('actLines', ['selectedPartnersValues', 'selectedCommunityValues']),
  },
  methods: {
    ...mapMutations('actLines', ['setCommunityFilter']),
  },
};
</script>

<style lang="scss" scoped></style>
