<template>
  <UiApiAutocomplete
    :items="billingAccounts"
    v-model="selectedBillingAccount"
    :error="errors"
    display-results-while-empty
    scroll-for-next
    :disabled="disabled"
    contains-search
  />
</template>

<script>
import { fetchBillibAccountForPartnerId } from '@/api/billingAccounts';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';

export default {
  components: {
    UiApiAutocomplete,
  },
  props: {
    // partnerId: String,
    partner: Object,
    preselectBillingAccount: Object,
    offer: Object,
    errors: {
      type: Object,
      required: false,
    },
    disabled: Boolean,
  },
  data() {
    return {
      billingAccounts: [],
      selectedBillingAccount: undefined,
    };
  },
  async mounted() {
    if (this.partner) {
      const data = await fetchBillibAccountForPartnerId(this.partner.id);
      this.billingAccounts = data.map(ba => ({
        id: ba.id,
        label: `${ba.code} - ${ba.name}`,
        partnerId: ba.party.id,
        partner: ba.party,
      }));

      if (this.billingAccounts && this.billingAccounts.length === 1) {
        this.selectedBillingAccount = this.billingAccounts[0];
      }

      if (this.preselectBillingAccount) {
        this.selectedBillingAccount = this.preselectBillingAccount;
      }
    }
  },
  watch: {
    selectedBillingAccount(newValue) {
      this.$emit('set:billingAccount', newValue);
    },
  },
};
</script>

<style lang="scss" scoped></style>
