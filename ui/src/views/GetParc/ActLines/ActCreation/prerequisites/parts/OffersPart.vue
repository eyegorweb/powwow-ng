<template>
  <UiApiAutocomplete
    :items="offers"
    v-model="selectedOffer"
    :error="errors"
    display-results-while-empty
    scroll-for-next
    :disabled="disabled"
    search-type="contain"
  />
</template>

<script>
import { fetchOffers } from '@/api/offers';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { mapState } from 'vuex';

export default {
  components: {
    UiApiAutocomplete,
  },
  props: {
    partner: Object,
    preselectOffer: Object,
    errors: {
      type: Object,
      required: false,
    },
    disabled: Boolean,
    allOffers: Boolean,
  },
  data() {
    return {
      offers: [],
      selectedOffer: undefined,
    };
  },
  async mounted() {
    this.refreshData(this.partner);
  },
  methods: {
    async refreshData(partner) {
      if (partner) {
        if (partner.id) {
          const queryParams = {
            page: 0,
            limit: 999,
            partnerType: this.contextPartnersType,
          };
          if (!this.allOffers) {
            queryParams.disabledOffer = true;
          }
          const data = await fetchOffers('', [partner], queryParams);
          if (data) {
            this.offers = data
              .filter(o => o.code !== this.prerequisiteOffer.code)
              .map(o => ({
                id: o.code,
                label: o.workflowDescription,
                data: o,
                productCode: o.code,
              }));
          }
        } else if (partner.label.length) {
          this.offers = [];
        }
      } else {
        this.offers = [];
        this.selectedOffer = undefined;
      }
    },
  },
  watch: {
    selectedOffer(newValue) {
      this.$emit('update:offer', newValue);
    },
    partner(partner) {
      this.refreshData(partner);
    },
  },

  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    ...mapState('actLines', ['actCreationPrerequisites']),
    prerequisiteOffer() {
      return this.actCreationPrerequisites && this.actCreationPrerequisites.offer
        ? this.actCreationPrerequisites.offer.data
        : '';
    },
  },
};
</script>

<style lang="scss" scoped></style>
