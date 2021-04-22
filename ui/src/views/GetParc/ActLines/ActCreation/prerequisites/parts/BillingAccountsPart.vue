<template>
  <UiApiAutocomplete
    :items="billingAccounts"
    v-model="selectedBillingAccount"
    :error="errors"
    display-results-while-empty
    scroll-for-next
    :disabled="disabled"
    search-type="contain"
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
    partner: Object,
    preselectBillingAccount: Object,
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
    this.refreshData(this.partner);
  },
  methods: {
    async refreshData(partner) {
      if (partner) {
        if (partner.id) {
          const data = await fetchBillibAccountForPartnerId(partner.id);
          this.billingAccounts = data.map((ba) => ({
            id: ba.id,
            label: `${ba.code} - ${ba.name}`,
            partnerId: ba.party.id,
            partner: ba.party,
            code: ba.code,
          }));

          if (
            this.billingAccounts &&
            this.billingAccounts.length === 1 &&
            partner.partyType !== 'MVNO'
          ) {
            this.selectedBillingAccount = this.billingAccounts[0];
          }

          if (this.preselectBillingAccount) {
            this.selectedBillingAccount = this.billingAccounts.find(
              (b) => b.id === this.preselectBillingAccount.id
            );
          }
        } else if (partner.label.length) {
          this.billingAccounts = [];
        }
      } else {
        this.billingAccounts = [];
        this.selectedBillingAccount = undefined;
      }
    },
  },
  watch: {
    selectedBillingAccount(newValue) {
      if (newValue && newValue.code) {
        this.$emit('set:billingAccount', newValue);
      } else {
        this.$emit('set:billingAccount', undefined);
      }
    },
    partner(partner) {
      this.refreshData(partner);
    },
  },
};
</script>

<style lang="scss" scoped></style>
