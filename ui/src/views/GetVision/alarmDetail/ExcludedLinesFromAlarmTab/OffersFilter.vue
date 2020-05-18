<template>
  <OffersFilter
    :selected-offers-values="selectedData || []"
    :selected-partners-values="[]"
    @setOffersFilter="values => $emit('change', values)"
  />
</template>

<script>
import OffersFilter from '@/components/Filters/OffersFilter';

export default {
  components: {
    OffersFilter,
  },
  props: {
    selectedData: Array,
  },
};
</script>

<style lang="scss" scoped></style>
