<template>
  <div>
    <h6>{{ $t('getparc.actLines.partnerTarget') }}</h6>
    <PartnersPart
      @setpartner="setPartner"
      :error="errors.partner"
      :limit-to-partners-in-search-bar="limitToPartnersInSearchBar"
    />
    <h6>{{ $t('getparc.actLines.billingAccountTarget') }}</h6>
    <UiApiAutocomplete
      v-if="canSeeBillingAccount"
      :disabled="!selectedPartner || !selectedPartner.id"
      :api-method="fetchBillingAccounts"
      scroll-for-next
      v-model="selectedBillingAccount"
      :error="errors.billingAccount"
      display-results-while-empty
    />

    <slot name="bottom"></slot>
  </div>
</template>

<script>
import PartnersPart from '../../prerequisites/parts/PartnersPart';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { fetchBillingAccounts } from '@/api/billingAccounts';

export default {
  components: {
    PartnersPart,
    UiApiAutocomplete,
  },
  props: {
    errors: {
      type: Object,
      required: false,
    },
    initialParnter: {
      type: Object,
      required: false,
    },
    limitToPartnersInSearchBar: Boolean,
  },
  data() {
    return {
      selectedPartner: undefined,
      billingAccounts: [],
      selectedBillingAccount: undefined,
      canSeeBillingAccount: true,
    };
  },
  methods: {
    setPartner(chosenPartner) {
      this.selectedPartner = chosenPartner;
      if (this.selectedPartner && this.selectedPartner.id) {
        this.canSeeBillingAccount = false;
        setTimeout(() => (this.canSeeBillingAccount = true));
      }
    },

    async fetchBillingAccounts(q, page = 0) {
      if (
        this.selectedBillingAccount &&
        this.selectedBillingAccount.partnerId !== this.selectedPartner.id
      ) {
        this.selectedBillingAccount = null;
      }

      const partners = [];
      if (this.selectedPartner) {
        partners.push(this.selectedPartner);
      }
      const data = await fetchBillingAccounts(q, partners, { page, limit: 10 });

      return data.map((ba) => ({
        id: ba.id,
        label: `${ba.code} - ${ba.name}`,
        data: ba,
        partnerId: ba.party.id,
        partner: ba.party,
        code: ba.code,
      }));
    },
  },
  watch: {
    selectedBillingAccount(newValue) {
      this.$emit('set:billingAccount', newValue);
    },
  },
};
</script>

<style lang="scss" scoped></style>
