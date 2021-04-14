<template>
  <PrereqContainer @validate="validatePrerequisites" :can-validate="canValidate">
    <div v-if="!partner" class="row">
      <div class="col">
        <h5>{{ $t('getparc.actLines.step1Partner') }}</h5>
        <PartnersPart @setpartner="setPartner" />
      </div>
      <div class="col">
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
        <div class="col">
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
import OffersPart from './parts/OffersPart';
import BillingAccountsPart from './parts/BillingAccountsPart';
import PrereqContainer from './parts/PrereqContainer';
import get from 'lodash.get';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

import SimCardsTypePart from './parts/SimCardsTypePart';

export default {
  components: {
    PartnersPart,
    PrereqContainer,
    OffersPart,
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

      return !this.isPartnerEmpty;
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
    ...mapActions('actLines', ['setPartnersFilter']),
    ...mapMutations('actLines', [
      'applyFilters',
      'resetForm',
      'setActCreationPrerequisites',
      'setBillingAccountsFilter',
      'setPageLimit',
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

      const allPrereq = {
        partner: this.selectedPartner,
        billingAccount: this.chosenBillingAccount,
        filePairing: !this.canSelectSimType
      };

      if (this.selectedTypeSimCard) {
        allPrereq.simcardType = this.selectedTypeSimCard;
      }

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
