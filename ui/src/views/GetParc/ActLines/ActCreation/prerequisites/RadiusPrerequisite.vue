<template>
  <PrereqContainer @validate="validatePrerequisites" :can-validate="canValidate">
    <div class="row">
      <div class="col" v-if="!partner">
        <h5>{{ $t('getparc.actLines.step1Partner') }}</h5>
        <PartnersPart @setpartner="setPartner" :partner-feature="partnerFeature" />
      </div>
      <div class="col">
        <h5>{{ $t('common.billingAccount') }}</h5>
        <BillingAccountsPart
          :disabled="!selectedPartner"
          :partner="selectedPartner"
          @set:billingAccount="setBillingAccount"
          @reset="resetFields"
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
          <template v-if="apnExists">
            <h5>{{ $t('APN') }}</h5>
            <ApnPart
              :disabled="!selectedOffer || (selectedOffer && !selectedOffer.label)"
              :offer="selectedOffer"
              :partner="selectedPartner"
              @update:value="selectApn"
              :apn.sync="selectedApn"
            />
          </template>
          <template v-if="!apnExists">
            <h5>{{ $t('Profile Data') }}</h5>
            <ProfileData
              :disabled="!selectedOffer || (selectedOffer && !selectedOffer.label)"
              :offer="selectedOffer"
              :partner="selectedPartner"
              @update:value="selectProfileData"
              :profile-data.sync="selectedProfileData"
            />
          </template>
        </div>
      </div>

      <div class="col">
        <div>
          <template v-if="!apnExists">
            <h5>{{ $t('DNN') }}</h5>
            <DnnPart
              :disabled="!selectedOffer || (selectedOffer && !selectedOffer.label)"
              :offer="selectedOffer"
              :partner="selectedPartner"
              :profile-data="selectedProfileData"
              @update:value="selectDnn"
              :dnn.sync="selectedDnn"
            />
          </template>
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
import DnnPart from './parts/DnnPart';
import ProfileData from './parts/ProfileData';
import BillingAccountsPart from './parts/BillingAccountsPart';
import get from 'lodash.get';
import { mapMutations } from 'vuex';
import { fetchRadiusAdministrationTypes } from '@/api/actCreation.js';

export default {
  components: {
    PartnersPart,
    PrereqContainer,
    OffersPart,
    BillingAccountsPart,
    ApnPart,
    DnnPart,
    ProfileData,
  },
  data() {
    return {
      selectedPartner: null,
      selectedApn: undefined,
      selectedProfileData: undefined,
      selectedDnn: undefined,
      offerData: null,
      apnExists: null,
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
    partnerFeature: String,
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
      return (
        (this.apnExists &&
          !this.isPartnerEmpty &&
          !!this.offerData &&
          !!this.selectedApn &&
          !!this.chosenBillingAccount) ||
        (!this.apnExists &&
          !!this.chosenBillingAccount &&
          !this.isPartnerEmpty &&
          !!this.offerData &&
          !!this.selectedProfileData &&
          !!this.selectedDnn)
      );
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
          if (
            this.listTechno.includes('APN') &&
            this.offerData.data.initialOffer.offerCategory === 'UPF'
          ) {
            this.apnExists = false;
          } else if (!this.listTechno.includes('APN')) {
            this.apnExists = false;
          } else this.apnExists = true;
        }
      },
    },
  },
  mounted() {
    this.apnExists = true;
    if (this.partner) {
      this.selectedPartner = { ...this.partner };
    }
  },
  methods: {
    ...mapMutations('actLines', ['resetForm']),
    setPartner(chosenPartner) {
      this.selectedPartner = chosenPartner;
      this.radiusAdministrationTypes(this.selectedPartner);
      this.selectedOffer = undefined;
      this.selectedProfileData = undefined;
      this.selectedDnn = undefined;
      this.selectedApn = undefined;
    },

    async radiusAdministrationTypes() {
      const data = await fetchRadiusAdministrationTypes(this.selectedPartner.id);
      if (data) {
        this.listTechno = data;
      }
    },

    setBillingAccount(billingAccount) {
      this.chosenBillingAccount = billingAccount;
    },

    validatePrerequisites() {
      this.$emit('set:preprequisites', {
        partner: this.selectedPartner,
        offer: this.selectedOffer,
        billingAccount: this.chosenBillingAccount,
        profileData: this.selectProfileData,
        apn: this.selectedApn,
        dnn: this.selectedDnn,
      });
    },
    resetOffer(emptyOffer) {
      this.selectedOffer = emptyOffer;
      this.selectedApn = undefined;
      this.selectedProfileData = undefined;
      this.selectedDnn = undefined;
    },
    resetFields() {
      this.setBillingAccount(undefined);
      this.selectedOffer = undefined;
      this.selectedApn = undefined;
      this.selectedProfileData = undefined;
      this.selectedDnn = undefined;
    },
    selectApn(apn) {
      this.selectedApn = apn;
    },
    selectProfileData(profileData) {
      this.selectedProfileData = profileData;
    },
    selectDnn(dnn) {
      this.selectedDnn = dnn;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
