<template>
  <PrereqContainer @validate="validatePrerequisites" :can-validate="canValidate">
    <div class="row">
      <div class="col">
        <h5>{{ $t('getparc.actLines.step1Partner') }}</h5>
        <PartnersPart @setpartner="setPartner" />
      </div>
      <div class="col">
        <div>
          <h5>{{ $t('col.offer') }}</h5>
          <OffersPart
            :partner="selectedPartner"
            :offer.sync="selectedOffer"
            :disabled="isPartnerEmpty"
          />
        </div>
      </div>
    </div>
  </PrereqContainer>
</template>

<script>
import PartnersPart from './PartnersPart';
import OffersPart from './OffersPart';
import PrereqContainer from './PrereqContainer';
import get from 'lodash.get';

import { mapMutations } from 'vuex';

export default {
  components: {
    PartnersPart,
    PrereqContainer,
    OffersPart,
  },
  data() {
    return {
      selectedPartner: null,
      offerData: null,
    };
  },
  computed: {
    canValidate() {
      return !this.isPartnerEmpty && !!this.offerData;
    },
    isPartnerEmpty() {
      return !get(this.selectedPartner, 'id');
    },
    selectedOffer: {
      get() {
        return this.offerData;
      },
      set(offer) {
        if (!offer || !offer.label || !offer.label.length) {
          this.resetForm();
          this.offerData = undefined;
        } else {
          this.offerData = offer;
        }
      },
    },
  },
  methods: {
    ...mapMutations('actLines', ['resetForm']),
    setPartner(chosenPartner) {
      this.selectedPartner = chosenPartner;
      this.selectedOffer = undefined;
    },
    validatePrerequisites() {
      this.$emit('set:preprequisites', {
        partner: this.selectedPartner,
        offer: this.selectedOffer,
        search: this.selectedPartner && this.selectedOffer,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
