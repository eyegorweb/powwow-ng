<template>
  <div>
    <h5>Séléctionner un partenaire</h5>
    <UiApiAutocomplete
      :api-method="fetchPartners"
      v-model="selectedPartner"
      display-results-while-empty
      scroll-for-next
    >
      <img style="font-size: 24px" class="arrow" src="@/assets/search.svg" :style="{ left: 0 }" />
    </UiApiAutocomplete>
  </div>
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { fetchpartners } from '@/api/partners';
import { mapState } from 'vuex';

export default {
  components: {
    UiApiAutocomplete,
  },
  computed: {
    ...mapState('userContext', ['contextPartnersTypes', 'contextPartners']),
  },
  data() {
    return {
      selectedPartner: null,
    };
  },
  watch: {
    selectedPartner(newValue) {
      this.$emit('setpartner', newValue);
    },
  },
  methods: {
    async fetchPartners(q, page = 0) {
      if (this.contextPartners && this.contextPartners.length) {
        return this.contextPartners;
      }
      const partnerTypesIn = this.contextPartnersTypes;
      const data = await fetchpartners(q, { page, limit: 10, partnerTypesIn });
      return data.map(p => ({
        id: p.id,
        label: p.name,
        orderNumberIsMandatory: p.orderNumberRequired,
      }));
    },
  },
};
</script>

<style lang="scss" scoped></style>
