<template>
  <div>
    <h6>{{ $t('getparc.actLines.step1Partner') }}</h6>
    <PartnersPart
      @setpartner="setPartner"
      :error="errors.partner"
      :initial-parnter="initialParnter"
    />
    <h6>{{ $t('getparc.actLines.billingAccount') }}</h6>
    <UiApiAutocomplete
      :items="billingAccounts"
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
import { fetchBillibAccountForPartnerId } from '@/api/billingAccounts';

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
  },
  data() {
    return {
      selectedPartner: undefined,
      billingAccounts: [],
      selectedBillingAccount: undefined,
    };
  },
  methods: {
    setPartner(chosenPartner) {
      this.selectedPartner = chosenPartner;
    },
  },
  watch: {
    async selectedPartner({ id }) {
      // NOTE: pendant que l'on tape, les valeurs sont remontes mais non validees. lorsque l'on click, on recupere la vrai valeur
      if (id == null) return;
      if (
        this.selectedBillingAccount &&
        this.selectedBillingAccount.partnerId !== this.selectedPartner.id
      ) {
        this.selectedBillingAccount = null;
      }

      const data = await fetchBillibAccountForPartnerId(id);
      this.billingAccounts = data.map(ba => ({
        id: ba.id,
        label: `${ba.code} - ${ba.name}`,
        partnerId: ba.party.id,
        partner: ba.party,
      }));

      if (this.billingAccounts && this.billingAccounts.length === 1) {
        this.selectedBillingAccount = this.billingAccounts[0];
      }
    },

    selectedBillingAccount(newValue) {
      this.$emit('set:billingAccount', newValue);
    },
  },
};
</script>

<style lang="scss" scoped></style>
