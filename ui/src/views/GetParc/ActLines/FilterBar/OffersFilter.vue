<template>
    <AutoCompleteByPartnerContext
        :values="selectedOffersValues"
        :selected-partners-values="selectedPartnersValues"
        :fetch-api="fetchApi"
        @update:values="setOffersFilter"
    />
</template>

<script>
import AutoCompleteByPartnerContext from '@/components/AutoCompleteByPartnerContext';
import { mapMutations, mapGetters } from 'vuex';
import { fetchOffers } from '@/api/offers';

export default {
  components: {
    AutoCompleteByPartnerContext,
  },
  computed: {
    ...mapGetters('getsim', ['selectedOffersValues', 'selectedPartnersValues']),
  },

  methods: {
    ...mapMutations('getsim', ['setOffersFilter']),

    async fetchApi(q, partners, partnerTypes, { page, limit }) {
      const data = await fetchOffers(q, partners, { page, limit, partnerTypes });
      if (data) {
        return data.map(o => ({
          id: o.code,
          label: o.workflowDescription,
        }));
      }
    },
  },
};
</script>

<style scoped></style>
