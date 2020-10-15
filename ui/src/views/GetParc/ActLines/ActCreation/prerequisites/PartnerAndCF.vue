<template>
  <PrereqContainer>
    <div class="row">
      <div class="col" v-if="!partner">
        <h5>{{ $t('getparc.actLines.step1Partner') }}</h5>
        <PartnersPart @setpartner="setPartner" />
      </div>
      <div class="col">
        <h5>{{ $t('getparc.actLines.billingAccount') }}</h5>
        <BillingAccountsPart
          :disabled="isPartnerMVNO"
          :key="`billingAccount_${selectedPartner ? selectedPartner.label : ''}`"
          :partner="selectedPartner"
          @set:billingAccount="chosenBillingAccount = $event"
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
    <div slot="validate"></div>
  </PrereqContainer>
</template>

<script>
import PrereqContainer from './parts/PrereqContainer';
import PartnersPart from './parts/PartnersPart';
import BillingAccountsPart from './parts/BillingAccountsPart';
import get from 'lodash.get';

export default {
  components: {
    PrereqContainer,
    PartnersPart,
    BillingAccountsPart,
  },

  props: {
    partner: {
      type: Object,
      default: undefined,
    },
  },

  mounted() {
    if (this.partner) {
      this.selectedPartner = { ...this.partner };
    }
  },

  watch: {
    partner(newValue) {
      this.selectedPartner = { ...newValue };
    },
  },

  data() {
    return {
      selectedPartner: undefined,
      chosenBillingAccount: undefined,
    };
  },

  computed: {
    canValidate() {
      return !this.isPartnerEmpty && !this.isChosenBillingAccountEmpty;
    },
    isPartnerEmpty() {
      return !get(this.selectedPartner, 'id');
    },
    isChosenBillingAccountEmpty() {
      return !get(this.chosenBillingAccount, 'id');
    },
    isPartnerMVNO() {
      if (!this.selectedPartner) return;
      const found = this.selectedPartner.partyType === 'MVNO';
      return found;
    },
  },

  methods: {
    setPartner(chosenPartner) {
      this.selectedPartner = chosenPartner;
      this.chosenBillingAccount = undefined;
    },

    validatePrerequisites() {
      this.$emit('set:preprequisites', {
        partner: this.selectedPartner,
        billingAccount: this.chosenBillingAccount,
        search: !this.isPartnerEmpty && !this.isChosenBillingAccountEmpty,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
