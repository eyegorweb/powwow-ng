<template>
  <ChoiceContainer @search="searchLines" :show-button="showButton">
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
          <p>Cette alarme a une portée limitée à la ligne sélectionnée</p>
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

      selectedOffer: undefined,
    };
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
