<template>
  <PrereqContainer @validate="validatePrerequisites" :can-validate="canValidate">
    <div v-if="!partner" class="row">
      <div class="col">
        <h5>{{ $t('getparc.actLines.step1Partner') }}</h5>
        <PartnersPart @setpartner="setPartner" />
      </div>
      <div v-if="canSelectCustomerAccount" class="col">
        <h5>{{ $t('getparc.actLines.billingAccount') }}</h5>
        <BillingAccountsPart :partner="selectedPartner" @set:billingAccount="setBillingAccount" />
      </div>
      <div v-if="canSelectSimType" class="col">
        <div>
          <h5>{{ $t('getparc.actLines.typeSimCard') }}</h5>
          <SimCardsTypePart
            :key="`simcards_${selectedPartner ? selectedPartner.label : ''}`"
            category="ESIM"
            :partner="selectedPartner"
            @set:simcard="setTypeSimCard"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <div class="row">
        <div v-if="canSelectCustomerAccount" class="col">
          <h5>{{ $t('getparc.actLines.billingAccount') }}</h5>
          <BillingAccountsPart :partner="selectedPartner" @set:billingAccount="setBillingAccount" />
        </div>
        <div v-if="canSelectSimType" class="col">
          <h5>{{ $t('getparc.actLines.typeSimCard') }}</h5>
          <SimCardsTypePart
            :key="`simcards_${selectedPartner ? selectedPartner.label : ''}`"
            category="ESIM"
            :partner="selectedPartner"
            @set:simcard="setTypeSimCard"
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
import BillingAccountsPart from './parts/BillingAccountsPart';
import PrereqContainer from './parts/PrereqContainer';
import { mapActions, mapMutations } from 'vuex';

import SimCardsTypePart from './parts/SimCardsTypePart';

export default {
  components: {
    PartnersPart,
    PrereqContainer,
    BillingAccountsPart,
    SimCardsTypePart,
  },
  data() {
    return {
      selectedPartner: null,
      offerData: null,
      chosenBillingAccount: null,
      offers: [],
      selectedTypeSimCard: undefined,
    };
  },
  props: {
    partner: {
      type: Object,
      default: undefined,
    },
    canSelectSimType: Boolean,
    canSelectCustomerAccount: Boolean,
    currentToggle: String,
  },
  watch: {
    partner(newValue) {
      this.setPartner(newValue);
    },
  },
  computed: {
    canValidate() {
      if (this.canSelectSimType) {
        return !this.isPartnerEmpty && !!this.selectedTypeSimCard;
      }
      if (this.canSelectCustomerAccount) {
        return !this.isPartnerEmpty && !!this.chosenBillingAccount;
      }

      return !this.isPartnerEmpty;
    },
    isPartnerEmpty() {
      return !this.$loGet(this.selectedPartner, 'id');
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
    this.initPrerequisites();
  },
  methods: {
    ...mapActions('actLines', ['setPartnersFilter', 'selectedTypeSimCardValues']),
    ...mapMutations('actLines', [
      'applyFilters',
      'resetForm',
      'setActCreationPrerequisites',
      'setBillingAccountsFilter',
      'setPageLimit',
      'setTypeSimCardFilter',
    ]),
    setPartner(chosenPartner) {
      this.selectedPartner = chosenPartner;
      this.selectedOffer = undefined;
    },
    setBillingAccount(billingAccount) {
      this.chosenBillingAccount = billingAccount;
      if (!this.chosenBillingAccount) {
        this.selectedTypeSimCard = undefined;
      }
    },

    initPrerequisites() {
      if (this.partner) {
        this.selectedPartner = { ...this.partner };
        this.setPrerequisites({
          search: true,
          isHidden: true,
          partner: this.selectedPartner,
          billingAccount: this.chosenBillingAccount,
          filePairing:
            this.currentToggle === 'filePairingEidIccid' || this.currentToggle === 'filePairing',
          simcardType: this.selectedTypeSimCard,
        });
      }
    },

    setPrerequisites(allPrereq) {
      this.resetForm();
      if (allPrereq.partner) {
        this.setPartnersFilter({
          partners: [allPrereq.partner],
          isHidden: !!this.selectedPartner,
        });
      }

      if (allPrereq.billingAccount) {
        this.setBillingAccountsFilter([allPrereq.billingAccount]);
      }

      if (allPrereq.selectedTypeSimCard) {
        this.setTypeSimCardFilter([this.selectedTypeSimCard]);
      }

      allPrereq = {
        partner: this.selectedPartner,
        billingAccount: this.chosenBillingAccount,
        filePairing:
          this.currentToggle === 'filePairingEidIccid' || this.currentToggle === 'filePairing',
        simcardType: this.selectedTypeSimCard,
      };

      if (allPrereq) {
        this.setActCreationPrerequisites(allPrereq);
        if (allPrereq.search) {
          this.applyFilters();
          this.setPageLimit(5);
        }
      }
    },

    validatePrerequisites() {
      /*
      this.$emit('set:preprequisites', {
        partner: this.selectedPartner,
        simcardType: this.selectedTypeSimCard,
        search: !!this.selectedPartner && !!this.selectedTypeSimCard,
        billingAccount: this.chosenBillingAccount,
      });
      //*/
      this.resetForm();
      if (this.selectedPartner) {
        this.setPartnersFilter({
          partners: [this.selectedPartner],
        });
      }
      if (this.chosenBillingAccount) {
        this.setBillingAccountsFilter([this.chosenBillingAccount]);
      }
      // Type carte sim
      if (this.selectedTypeSimCard) {
        this.setTypeSimCardFilter([this.selectedTypeSimCard]);
      }

      const allPrereq = {
        partner: this.selectedPartner,
        billingAccount: this.chosenBillingAccount,
        filePairing:
          this.currentToggle === 'filePairingEidIccid' || this.currentToggle === 'filePairing',
        simcardType: this.selectedTypeSimCard,
      };

      this.setActCreationPrerequisites(allPrereq);

      let search = !!this.selectedPartner;
      if (this.canSelectSimType) {
        search = !!this.selectedPartner && !!this.selectedTypeSimCard;
      }

      if (search) {
        this.applyFilters();
        this.setPageLimit(5);
      }
    },
    setTypeSimCard(simcard) {
      this.selectedTypeSimCard = simcard;
    },
  },
};
</script>

<style lang="scss" scoped></style>
