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
  </ChoiceContainer>
</template>

<script>
import OfferBillingAccountCombo from '@/components/CustomComboxes/OfferBillingAccountCombo.vue';
import ChoiceContainer from './ChoiceContainer';

export default {
  components: {
    OfferBillingAccountCombo,
    ChoiceContainer,
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
      /*
      this.isLoading = true;
      this.showButton = true;

      await delay(1000);
      this.isLoading = false;
      //*/
    },
  },
};
</script>

<style lang="scss" scoped></style>
