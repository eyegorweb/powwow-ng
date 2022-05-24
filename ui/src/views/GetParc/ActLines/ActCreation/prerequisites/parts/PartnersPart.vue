<template>
  <div class="partner-prereq">
    <UiApiAutocomplete
      :api-method="getFetchFn()"
      :items="limitedPartnersToSelectFrom"
      v-model="selectedPartner"
      :error="error"
      display-results-while-empty
      scroll-for-next
    >
      <img
        style="font-size: 24px"
        class="arrow"
        src="@/assets/search.svg"
        :style="{ left: 0 }"
        alt=""
      />
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
    limitToPartnersInSearchBar: {
      type: Boolean,
      default: true,
    },
    esim: Boolean,
    haveLvOffers: Boolean,
    partnerType: String,
    actIsCf: Boolean,
  },
  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    ...mapGetters('actLines', ['selectedPartnersValues']),
    ...mapGetters(['userIsBO']),

    partyTypeMC() {
      return ((this.userIsBO || this.userIsAdmin()) && this.actIsCf)
    }
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

    if (
      this.limitToPartnersInSearchBar &&
      this.selectedPartnersValues &&
      this.selectedPartnersValues.length
    ) {
      this.limitedPartnersToSelectFrom = [...this.selectedPartnersValues];

      if (this.limitedPartnersToSelectFrom.length === 1 && this.limitedPartnersToSelectFrom[0].partyType !== 'MULTI_CUSTOMER') {
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
    ...mapGetters(['userIsAdmin']),
    getFetchFn() {
      if (this.limitedPartnersToSelectFrom) {
        return undefined;
      }
      return async (q, page = 0) => {
        if (this.contextPartners && this.contextPartners.length) {
          return this.contextPartners;
        }
        const data = await fetchpartners(q, {
          page,
          limit: 10,
          partnerType: this.contextPartnersType ? this.contextPartnersType : this.partnerType,
          esim: this.esim,
          haveLvOffers: this.haveLvOffers,
          partyTypeMC: this.partyTypeMC,
          
        });
        return data.map((p) => ({
          id: p.id,
          label: p.name,
          partyType: p.partyType,
        }));
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
