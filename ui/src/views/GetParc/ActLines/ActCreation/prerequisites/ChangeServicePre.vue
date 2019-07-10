<template>
  <PrereqContainer @validate="validatePrerequisites">
    <div class="row">
      <div class="col">
        <h5>{{ $t('getparc.actLines.step1Partner') }}</h5>
        <PartnersPart @setpartner="setPartner" />
      </div>
      <div class="col">
        <div v-if="selectedPartner && selectedPartner.id">
          <h5>{{ $t('col.offer') }}</h5>
          <OffersPart :partner="selectedPartner" :offer.sync="selectedOffer" />
        </div>
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
