<template>
  <ChoiceContainer
    @search="searchLines"
    :show-button="showButton"
    :show-result-block="!!params"
    message-height="15rem"
  >
    <template slot="form">
      <OfferBillingAccountCombo :value.sync="selectedOfferCF" :partner="partner" />
    </template>
    <template slot="message">
      <ScopeSearchMessage :is-loading="isLoading" @refresh="searchLines">
        <template v-if="isLoading">
          <span>{{ $t('loading') }}...</span>
        </template>
        <template v-else>
          <h5>1 lignes trouvées</h5>
        </template>
      </ScopeSearchMessage>
    </template>
  </ChoiceContainer>
</template>

<script>
import OfferBillingAccountCombo from '@/components/CustomComboxes/OfferBillingAccountCombo.vue';
import ChoiceContainer from './ChoiceContainer';
import ScopeSearchMessage from './ScopeSearchMessage';

import { delay } from '@/api/utils.js';

export default {
  components: {
    OfferBillingAccountCombo,
    ChoiceContainer,
    ScopeSearchMessage,
  },

  props: {
    partner: Object,
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
      selectedOfferCF: undefined,
      value: undefined,
      showButton: false,
      isLoading: false,
      params: undefined,

      selectedOffer: undefined,
    };
  },

  watch: {
    selectedOfferCF(offerCF) {
      if (offerCF) {
        this.params = {
          offerCF,
        };
      } else {
        this.params = undefined;
      }

      this.$emit('change', this.params);
    },
  },
  methods: {
    async searchLines() {
      this.isLoading = true;
      this.showButton = true;

      await delay(1000);
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
