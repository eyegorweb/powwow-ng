<template>
  <ChoiceContainer
    @search="searchLines"
    :show-button="showButton"
    :show-result-block="!!params"
    message-height="15rem"
  >
    <template slot="form">
      <h6>{{ $t('alarms.alarmScope.OFFER') }}</h6>
      <OfferCombo :value.sync="selectedOffer" :partners="partners" />
      <template v-if="selectedOffer">
        <h6>{{ $t('common.billingAccount') }}</h6>

        <BillingAccountCombo :value.sync="selectedBillingAccount" :partners="partners" />
      </template>
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
import BillingAccountCombo from '@/components/CustomComboxes/BillingAccountCombo.vue';
import ChoiceContainer from './ChoiceContainer';
import ScopeSearchMessage from './ScopeSearchMessage';

import { countLines } from '@/api/linesActions.js';

export default {
  components: {
    OfferCombo,
    ChoiceContainer,
    ScopeSearchMessage,
    BillingAccountCombo,
  },

  props: {
    partner: Object,
  },

  watch: {
    selectedOffer(offer) {
      if (offer) {
        this.params = {
          offer,
          billingAccount: this.selectedBillingAccount,
          partnerId: this.partner.id,
        };
      } else {
        this.params = undefined;
        this.selectedBillingAccount = undefined;
      }

      this.$emit('change', this.params);
    },
    selectedBillingAccount(billingAccount) {
      if (this.selectedOffer && billingAccount) {
        this.params = {
          offer: this.selectedOffer,
          partnerId: this.partner.id,
          billingAccount,
        };
      } else {
        this.params = undefined;
      }

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
          values: [{ productCode: this.selectedOffer.meta.initialOffer.code }],
        },
      ];

      if (this.selectedBillingAccount) {
        filters.push({
          id: 'filters.billingAccounts',
          values: [{ id: this.selectedBillingAccount.value }],
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
