<template>
  <PrereqContainer @validate="validatePrerequisites">
    <div class="row">
      <div class="col">
        <PartnersPart @setpartner="setPartner" />
      </div>
      <div class="col">
        <OffersPart @setOffer="setOffer" :partner="selectedPartner" />
      </div>
    </div>
  </PrereqContainer>
</template>

<script>
import PartnersPart from './parts/PartnersPart';
import OffersPart from './parts/OffersPart';
import PrereqContainer from './parts/PrereqContainer';

export default {
  components: {
    PartnersPart,
    PrereqContainer,
    OffersPart,
  },
  data() {
    return {
      selectedPartner: null,
      selectedOffer: null,
    };
  },
  methods: {
    setPartner(chosenPartner) {
      this.selectedPartner = chosenPartner;
    },
    setOffer(selectedOffer) {
      console.log(selectedOffer);
      this.selectedOffer = selectedOffer;
    },
    validatePrerequisites() {
      this.$emit('set:preprequisites', {
        partner: this.selectedPartner,
        offer: this.selectedOffer,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
