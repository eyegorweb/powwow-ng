<template>
  <div>
    <h6>{{ $t('getparc.actLines.partnerTarget') }}</h6>
    <PartnersPart
      @setpartner="setPartner"
      :error="errors.partner"
      :limit-to-partners-in-search-bar="limitToPartnersInSearchBar"
    />
    <h6>{{ $t('getparc.actLines.billingAccountTarget') }}</h6>

    <BillingAccountAutocomplete
      v-model="selectedBillingAccount"
      :selected-partner="selectedPartner"
      :disabled="!selectedPartner || !selectedPartner.id"
      :error="errors.billingAccount"
      preselect-first-only-when-one-item
    />

    <slot name="bottom"></slot>
  </div>
</template>

<script>
import PartnersPart from '../../prerequisites/parts/PartnersPart';
import BillingAccountAutocomplete from '@/components/CustomComboxes/BillingAccountAutocomplete.vue';

export default {
  components: {
    PartnersPart,
    BillingAccountAutocomplete,
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
  },
  watch: {
    selectedBillingAccount(newValue) {
      this.$emit('set:billingAccount', newValue);
    },
  },
};
</script>

<style lang="scss" scoped></style>
