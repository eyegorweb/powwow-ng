<template>
  <div>
    <h6>{{ $t('getparc.actLines.billingAccount') }}</h6>
    <UiApiAutocomplete
      :items="billingAccounts"
      v-model="selectedBillingAccount"
      :error="errors.billingAccount"
      display-results-while-empty
    />
  </div>
</template>

<script>
import { fetchBillibAccountForPartnerId } from '@/api/billingAccounts';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { mapState } from 'vuex';

export default {
  components: {
    UiApiAutocomplete,
  },
  props: {
    partnerId: String,
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
  async mounted() {
    const data = await fetchBillibAccountForPartnerId(this.partnerId);
    this.billingAccounts = data
      .filter(ba => ba.id !== this.prerequisiteBillingAccount.id)
      .map(ba => ({
        id: ba.id,
        label: `${ba.code} - ${ba.name}`,
        partnerId: ba.party.id,
        partner: ba.party,
      }));

    if (this.billingAccounts && this.billingAccounts.length === 1) {
      this.selectedBillingAccount = this.billingAccounts[0];
    }
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
};
</script>

<style lang="scss" scoped></style>
