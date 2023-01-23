<template>
  <ChoiceContainer
    @search="searchLines"
    :show-button="showButton"
    :show-result-block="!!params"
    message-height="15rem"
  >
    <template slot="form">
      <h6>{{ $t('alarms.alarmScope.OFFER') }}</h6>
      <OfferCombo v-model="selectedOffer" :partners="partners" />

      <h6>{{ $t('common.billingAccount') }}</h6>
      <BillingAccountAutocomplete v-model="selectedBillingAccount" :selected-partner="partner" />
    </template>
    <template slot="message">
      <ScopeSearchMessage :is-loading="isLoading" @refresh="searchLines">
        <template v-if="isLoading">
          <span>{{ $t('loading') }}...</span>
        </template>
        <template v-else>
          <h5>{{ totalLines }} {{ $t('getvsion.alarm-creation.linesFound') }}</h5>
          <p>{{ $t('getvsion.alarm-creation.limitedScope') }}</p>
        </template>
      </ScopeSearchMessage>
    </template>
  </ChoiceContainer>
</template>

<script>
import OfferCombo from '@/components/CustomComboxes/OfferCombo.vue';
import ChoiceContainer from './ChoiceContainer';
import ScopeSearchMessage from './ScopeSearchMessage';
import BillingAccountAutocomplete from '@/components/CustomComboxes/BillingAccountAutocomplete.vue';

import { countLines } from '@/api/linesActions.js';

export default {
  components: {
    OfferCombo,
    ChoiceContainer,
    ScopeSearchMessage,
    BillingAccountAutocomplete,
  },

  props: {
    partner: Object,
  },

  watch: {
    selectedOffer(offer) {
      this.params = {
        offer,
        billingAccount: this.selectedBillingAccount,
        partnerId: this.partner.id,
      };
      this.$emit('change', this.params);
    },
    selectedBillingAccount(billingAccount) {
      this.params = {
        offer: this.selectedOffer,
        partnerId: this.partner.id,
        billingAccount,
      };
      this.$emit('change', this.params);
    },
  },
  computed: {
    partners() {
      if (!this.partner) return undefined;
      return [this.partner];
    },
  },

  data() {
    return {
      searchByIdValue: undefined,
      value: undefined,
      showButton: true,
      isLoading: false,

      selectedOffer: undefined,
      selectedBillingAccount: undefined,
      params: undefined,
      totalLines: 0,
    };
  },
  methods: {
    async searchLines() {
      this.isLoading = true;
      const filters = [
        {
          id: 'filters.lines.associatedOffer',
          values: [{ id: this.selectedOffer.meta.initialOffer.id }],
        },
      ];

      if (this.selectedBillingAccount) {
        filters.push({
          id: 'filters.billingAccounts',
          values: [{ id: this.selectedBillingAccount.id }],
        });
      }
      this.totalLines = await countLines(filters);

      this.showButton = false;
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
