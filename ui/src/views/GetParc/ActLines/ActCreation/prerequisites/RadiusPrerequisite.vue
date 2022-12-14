<template>
  <PrereqContainer @validate="validatePrerequisites" :can-validate="canValidate">
    <div class="row">
      <div class="col" v-if="!partner">
        <h5>{{ $t('getparc.actLines.step1Partner') }}</h5>
        <PartnersPart @setpartner="setPartner" />
      </div>
      <div class="col">
        <h5>{{ $t('common.billingAccount') }}</h5>
        <BillingAccountsPart
          :disabled="!selectedPartner"
          :partner="selectedPartner"
          @set:billingAccount="setBillingAccount"
        />
      </div>
      <div class="col">
        <div>
          <h5>{{ $t('col.offer') }}</h5>
          <OffersPart
            :partner="selectedPartner"
            :chosen-billing-account="chosenBillingAccount"
            :offer.sync="selectedOffer"
            :disabled="isPartnerEmpty"
            :all-offers="allOffers"
            keep-selected-value
            billing-account-mandatory
            @reset:offer="resetOffer"
          />
        </div>
      </div>
      <div class="col">
        <div>
          <h5>{{ $t('APN') }}</h5>
          <ApnPart
            :disabled="!selectedOffer || (selectedOffer && !selectedOffer.label)"
            :offer="selectedOffer"
            :partner="selectedPartner"
            @update:value="selectApn"
            :apn.sync="selectedApn"
          />
        </div>
      </div>
    </div>
  </PrereqContainer>
</template>

<script>
import PrereqContainer from './parts/PrereqContainer';
import PartnersPart from './parts/PartnersPart';
import OffersPart from './parts/OffersPart';
import ApnPart from './parts/ApnPart';
import BillingAccountsPart from './parts/BillingAccountsPart';
import get from 'lodash.get';
import { mapMutations } from 'vuex';

export default {
  components: {
    PartnersPart,
    PrereqContainer,
    OffersPart,
    BillingAccountsPart,
    ApnPart,
  },
  data() {
    return {
      selectedPartner: null,
      selectedApn: undefined,
      offerData: null,
      chosenBillingAccount: null,
      offers: [],
    };
  },
  props: {
    partner: {
      type: Object,
      default: undefined,
    },
    allOffers: Boolean,
  },
  watch: {
    partner(newValue) {
      this.setPartner(newValue);
    },
    selectedApn(apn) {
      return apn;
    },
  },
  computed: {
    canValidate() {
      return !this.isPartnerEmpty && !!this.offerData && !!this.selectedApn;
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
  mounted() {
    if (this.partner) {
      this.selectedPartner = { ...this.partner };
    }
  },
  methods: {
    ...mapMutations('actLines', ['resetForm']),
    setPartner(chosenPartner) {
      this.selectedPartner = chosenPartner;
      this.selectedOffer = undefined;
    },
    setBillingAccount(billingAccount) {
      this.chosenBillingAccount = billingAccount;
    },

    validatePrerequisites() {
      this.$emit('set:preprequisites', {
        partner: this.selectedPartner,
        offer: this.selectedOffer,
        billingAccount: this.chosenBillingAccount,
        apn: this.selectedApn,
      });
    },
    resetOffer(emptyOffer) {
      this.selectedOffer = emptyOffer;
      this.selectedApn = undefined;
    },
    selectApn(apn) {
      this.selectedApn = apn;
    },
  },
};
</script>

<style lang="scss" scoped></style>
