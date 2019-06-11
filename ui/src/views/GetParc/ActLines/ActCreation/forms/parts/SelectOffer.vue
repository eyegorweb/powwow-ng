<template>
  <div>
    <h5>{{ $t(title) }}</h5>
    <OffersFilter
      :selected-offers-values="selectedOffersValues"
      :selected-partners-values="[]"
      @setOffersFilter="values => setOffersFilter(values)"
    />
  </div>
</template>

<script>
import OffersFilter from '@/components/Filters/OffersFilter';

export default {
  components: {
    OffersFilter,
  },
  props: {
    title: String,
  },
  data() {
    return {
      selectedOffersValues: [],
    };
  },
  methods: {
    setOffersFilter(values) {
      this.selectedOffersValues = values;
      this.$emit('setOffers', values);
    },
  },
};
</script>

<style lang="scss" scoped>
h5 {
  font-size: 1rem;
}
</style>
