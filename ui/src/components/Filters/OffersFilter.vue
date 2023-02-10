<template>
  <AutoCompleteByPartnerContext
    :values="selectedOffersValues"
    :selected-partners-values="selectedPartnersValues"
    :fetch-api="fetchApi"
    @update:values="(values) => $emit('setOffersFilter', values)"
  />
</template>

<script>
import AutoCompleteByPartnerContext from '@/components/AutoCompleteByPartnerContext';
import { fetchOffers } from '@/api/offers';

export default {
  components: {
    AutoCompleteByPartnerContext,
  },

  props: {
    selectedOffersValues: Array,
    selectedPartnersValues: Array,
    expandedDataAttributes: Boolean,
  },

  methods: {
    async fetchApi(q, partners, partnerType, { page, limit }) {
      try {
        let data = await fetchOffers(q, partners, { page, limit, partnerType });
        if (data) {
          return data
            .map((o) => ({
              id: o.code,
              label: o.workflowDescription,
              data: o,
            }))
            .reduce((all, offer) => {
              const isFound = all.find((w) => w.id === offer.id);
              if (!isFound) {
                if (this.expandedDataAttributes) {
                  all.push(offer);
                } else {
                  /**
                   * Pour forcer la valeur de l'objet à une structure id/label égale à la structure des checkboxes
                   */
                  all.push({ id: offer.id, label: offer.label });
                }
              }
              return all;
            }, []);
        }
      } catch (e) {
        console.log('>> ', e);
      }
    },
  },
};
</script>

<style scoped></style>
