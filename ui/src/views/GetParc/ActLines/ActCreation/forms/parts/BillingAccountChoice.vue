<template>
  <div class="cmp-billing-account-choice">
    <h6>{{ $t('getparc.actLines.billingAccount') }}</h6>
    <UiApiAutocomplete
      v-model="selectedBillingAccount"
      :error="errors.billingAccount"
      display-results-while-empty
      scroll-for-next
      :api-method="fetchBillingAccounts"
    />
  </div>
</template>

<script>
import { fetchBillingAccountsForChangeAccount } from '@/api/billingAccounts';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { mapState } from 'vuex';

export default {
  components: {
    UiApiAutocomplete,
  },
  props: {
    partner: Object,
    errors: {
      type: Object,
      required: false,
    },
    previousBillingAccount: Object,
  },
  data() {
    return {
      billingAccounts: [],
      selectedBillingAccount: undefined,
    };
  },

  computed: {
    ...mapState('actLines', ['actCreationPrerequisites']),
    prerequisiteBillingAccount() {
      return this.actCreationPrerequisites && this.actCreationPrerequisites.billingAccount
        ? this.actCreationPrerequisites.billingAccount
        : '';
    },
  },
  watch: {
    selectedBillingAccount(newValue) {
      this.$emit('set:billingAccount', newValue);
    },
  },

  methods: {
    getPreviousBillingAccount() {
      if (this.previousBillingAccount) {
        return this.previousBillingAccount;
      }
      return this.prerequisiteBillingAccount;
    },
    async fetchBillingAccounts(q, page = 0) {
      const partners = [];
      if (this.partner) {
        partners.push(this.partner);
      }
      const data = await fetchBillingAccountsForChangeAccount(
        q,
        partners,
        this.getPreviousBillingAccount(),
        { page, limit: 10 }
      );
      return data.map((ba) => ({
        id: ba.id,
        label: `${ba.code} - ${ba.name}`,
        partnerId: ba.party.id,
        partner: ba.party,
      }));
    },
  },
};
</script>

<style lang="scss" scoped></style>
