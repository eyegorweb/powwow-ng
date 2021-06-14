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
import { fetchBillingAccounts } from '@/api/billingAccounts';
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
    async fetchBillingAccounts(q, page = 0) {
      const partners = [];
      if (this.partner) {
        partners.push(this.partner);
      }
      const data = await fetchBillingAccounts(q, partners, { page, limit: 10 });
      return data
        .filter((ba) => ba.id !== this.prerequisiteBillingAccount.id)
        .map((ba) => ({
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
