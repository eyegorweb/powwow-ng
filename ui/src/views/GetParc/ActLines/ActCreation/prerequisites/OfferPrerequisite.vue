<template>
  <PrereqContainer @validate="validatePrerequisites" :can-validate="canValidate">
    <div v-if="!partner" class="row">
      <div class="col">
        <h5>{{ $t('getparc.actLines.step1Partner') }}</h5>
        <PartnersPart @setpartner="setPartner" />
      </div>
      <div v-if="canSelectBillingAccount" class="col">
        <h5>{{ $t('getparc.actLines.billingAccount') }}</h5>
        <BillingAccountsPart :partner="selectedPartner" @set:billingAccount="setBillingAccount" />
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
          />
        </div>
      </div>
    </div>
    <div v-else>
      <div class="row">
        <div v-if="canSelectBillingAccount" class="col">
          <h5>{{ $t('getparc.actLines.billingAccount') }}</h5>
          <BillingAccountsPart :partner="selectedPartner" @set:billingAccount="setBillingAccount" />
        </div>
        <div class="col">
          <h5>{{ $t('col.offer') }}</h5>
          <OffersPart
            :partner="selectedPartner"
            :offer.sync="selectedOffer"
            :disabled="isPartnerEmpty"
            :all-offers="allOffers"
          />
        </div>
        <div class="pl-1 to-bottom">
          <button
            @click="validatePrerequisites"
            :disabled="!canValidate"
            class="btn btn-primary pl-4 pr-4 pt-2 pb-2"
          >
            {{ $t('set') }}
          </button>
        </div>
      </div>
    </div>
    <div v-if="partner" slot="validate"></div>
  </PrereqContainer>
</template>

<script>
import PartnersPart from './parts/PartnersPart';
import OffersPart from './parts/OffersPart';
import BillingAccountsPart from './parts/BillingAccountsPart';
import PrereqContainer from './parts/PrereqContainer';
import get from 'lodash.get';
import { mapMutations } from 'vuex';

export default {
  components: {
    PartnersPart,
    PrereqContainer,
    OffersPart,
    BillingAccountsPart,
  },
  data() {
    return {
      selectedPartner: null,
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
    canSelectBillingAccount: Boolean,
    allOffers: Boolean,
  },
  watch: {
    partner(newValue) {
      this.setPartner(newValue);
    },
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
        search: !!this.selectedPartner && !!this.selectedOffer,
        billingAccount: this.chosenBillingAccount,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
