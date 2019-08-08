<template>
  <div>
    <UiApiAutocomplete
      :api-method="getFetchFn()"
      :items="limitedPartnersToSelectFrom"
      v-model="selectedPartner"
      :error="error"
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
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    UiApiAutocomplete,
  },
  props: {
    error: {
      type: String,
      required: false,
    },
    initialParnter: {
      type: Object,
      required: false,
    },
  },
  computed: {
    ...mapState('userContext', ['contextPartnersTypes', 'contextPartners']),
    ...mapGetters('actLines', ['selectedPartnersValues']),
  },
  mounted() {
    if (this.initialParnter) {
      this.selectedPartner = this.initialParnter;
    }

    if (this.contextPartners && this.contextPartners.length === 1) {
      this.selectedPartner = this.contextPartners[0];
      this.$emit('setAndSearch', this.contextPartners[0]);
      return;
    }

    if (this.selectedPartnersValues && this.selectedPartnersValues.length) {
      this.limitedPartnersToSelectFrom = [...this.selectedPartnersValues];

      if (this.limitedPartnersToSelectFrom.length === 1) {
        this.selectedPartner = this.limitedPartnersToSelectFrom[0];
        this.$emit('setAndSearch', this.selectedPartner);
      }
    } else {
      this.limitedPartnersToSelectFrom = undefined;
    }
  },
  data() {
    return {
      selectedPartner: null,
      limitedPartnersToSelectFrom: undefined,
    };
  },
  watch: {
    selectedPartner(newValue) {
      this.$emit('setpartner', newValue);
    },
  },
  methods: {
    getFetchFn() {
      if (this.limitedPartnersToSelectFrom) {
        return undefined;
      }
      return async (q, page = 0) => {
        if (this.contextPartners && this.contextPartners.length) {
          return this.contextPartners;
        }
        const partnerTypesIn = this.contextPartnersTypes;
        const data = await fetchpartners(q, { page, limit: 10, partnerTypesIn });
        return data.map(p => ({
          id: p.id,
          label: p.name,
          orderNumberIsMandatory: p.orderNumberRequired,
          shortCodes: p.shortCodes,
          partyType: p.partyType,
        }));
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
