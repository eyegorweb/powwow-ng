<template>
  <PrereqContainer @validate="validatePrerequisites" :can-validate="canValidate">
    <div class="row">
      <div class="col">
        <h5>{{ $t('getparc.actLines.step1Partner') }}</h5>
        <PartnersPart @setpartner="setPartner" />
      </div>
      <div class="col">
        <h5>{{ $t('getparc.actLines.billingAccount') }}</h5>
        <BillingAccountsPart :partner="selectedPartner" @set:billingAccount="setBillingAccount" />
      </div>
      <div class="col">
        <h5>{{ $t('filters.lines.community') }}</h5>
        <CommunityPart
          :key="`community_${selectedPartner ? selectedPartner.label : ''}`"
          :partner="selectedPartner"
          @set:community="setCommunity"
        />
      </div>
    </div>
    <div v-if="partner" slot="validate"></div>
  </PrereqContainer>
</template>

<script>
import PrereqContainer from './parts/PrereqContainer';
import PartnersPart from './parts/PartnersPart';
import BillingAccountsPart from './parts/BillingAccountsPart';
import CommunityPart from './parts/CommunityPart';
import { mapActions, mapMutations } from 'vuex';

export default {
  components: {
    PrereqContainer,
    PartnersPart,
    BillingAccountsPart,
    CommunityPart,
  },

  props: {
    partner: {
      type: Object,
      default: undefined,
    },
    // canSelectSimType: Boolean,
  },

  data() {
    return {
      selectedPartner: null,
      chosenBillingAccount: null,
      selectedCommunity: undefined,
    };
  },

  mounted() {
    if (this.partner) {
      this.selectedPartner = { ...this.partner };
    }
  },

  computed: {
    canValidate() {
      return !this.isPartnerEmpty && !!this.chosenBillingAccount && !!this.selectedCommunity;
    },
    isPartnerEmpty() {
      return !this.$loGet(this.selectedPartner, 'id');
    },
  },

  methods: {
    ...mapActions('actLines', ['setPartnersFilter']),
    ...mapMutations('actLines', [
      'applyFilters',
      'resetForm',
      'setActCreationPrerequisites',
      'setBillingAccountsFilter',
      'setCommunityFilter',
      'setPageLimit',
    ]),
    setPartner(chosenPartner) {
      this.selectedPartner = chosenPartner;
    },
    setBillingAccount(billingAccount) {
      this.chosenBillingAccount = billingAccount;
      if (!this.chosenBillingAccount) {
        this.selectedCommunity = undefined;
      }
    },
    setCommunity(value) {
      this.selectedCommunity = value;
    },
    validatePrerequisites() {
      this.resetForm();
      if (this.selectedPartner) {
        this.setPartnersFilter({
          partners: [this.selectedPartner],
        });
      }
      if (this.chosenBillingAccount) {
        this.setBillingAccountsFilter([this.chosenBillingAccount]);
      }
      if (this.selectedCommunity) {
        this.setCommunityFilter([this.selectedCommunity]);
      }

      const allPrereq = {
        partner: this.selectedPartner,
        billingAccount: this.chosenBillingAccount,
        community: this.selectedCommunity,
      };

      this.setActCreationPrerequisites(allPrereq);

      let search = !!this.selectedPartner;
      //   if (this.canSelectSimType) {
      //     search = !!this.selectedPartner && !!this.selectedCommunity;
      //   }

      if (search) {
        this.applyFilters();
        this.setPageLimit(5);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
