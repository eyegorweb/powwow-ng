<template>
  <PrereqContainer>
    <template v-if="shouldChooseCF">
      <div class="row">
        <div class="col p-0 pr-4">
          <h5>{{ $t('getparc.actLines.step1Partner') }}</h5>
          <PartnersPart @setpartner="setPartner" />
        </div>
        <div class="col p-0">
          <h5>{{ $t('getparc.actLines.billingAccount') }}</h5>
          <BillingAccountsPart
            :disabled="isPartnerMVNO"
            :partner="!isPartnerMVNO ? selectedPartner : undefined"
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
    </template>
    <template v-else>
      <div class="d-flex justify-content-center">
        <div class="w-50">
          <h5>{{ $t('getparc.actLines.step1Partner') }}</h5>
          <PartnersPart @setpartner="setPartner" @setAndSearch="setAndSearch" />
        </div>
        <div class="pl-1 to-bottom">
          <button
            @click="validatePrerequisites"
            :disabled="!selectedPartner"
            class="btn btn-primary pl-4 pr-4 pt-2 pb-2"
          >
            {{ $t('set') }}
          </button>
        </div>
      </div>
    </template>
    <div slot="validate"></div>
  </PrereqContainer>
</template>
<script>
import PrereqContainer from './parts/PrereqContainer';
import PartnersPart from './parts/PartnersPart';
import BillingAccountsPart from './parts/BillingAccountsPart';
import get from 'lodash.get';
import { mapGetters } from 'vuex';

export default {
  components: {
    PrereqContainer,
    PartnersPart,
    BillingAccountsPart,
  },
  props: {
    userPartner: {
      type: Object,
      default: undefined,
    },
  },
  mounted() {
    if (this.userPartner) {
      this.selectedPartner = { ...this.userPartner };
    }
  },

  watch: {
    userPartner(userPartner) {
      if (userPartner) {
        this.selectedPartner = { ...userPartner };
      }
    },
  },

  data() {
    return {
      selectedPartner: undefined,
      chosenBillingAccount: undefined,
    };
  },
  computed: {
    ...mapGetters(['userIsMultiCustomer']),
    canValidate() {
      if (this.isPartnerMVNO) {
        return true;
      }
      return !this.isPartnerEmpty && !this.isChosenBillingAccountEmpty;
    },
    isPartnerEmpty() {
      return !get(this.selectedPartner, 'id');
    },
    isChosenBillingAccountEmpty() {
      return !get(this.chosenBillingAccount, 'id');
    },
    isPartnerMVNO() {
      if (this.isPartnerEmpty) return;
      return this.selectedPartner.partyType === 'MVNO';
    },
    shouldChooseCF() {
      if (!this.userIsMultiCustomer) {
        if (this.$loGet(this.selectedPartner, 'partyType') === 'MULTI_CUSTOMER') {
          return true;
        }
        return false;
      } else {
        return true;
      }
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
        search: true,
      });
    },
    setAndSearch(partner) {
      this.selectedPartner = partner;
      this.$emit('set:preprequisites', {
        partner,
        search: true,
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
