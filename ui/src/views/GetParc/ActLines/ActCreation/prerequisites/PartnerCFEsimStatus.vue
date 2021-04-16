<template>
  <PrereqContainer>
    <div class="row">
      <div class="col p-0 pr-4" v-if="!userPartner">
        <h5>{{ $t('getparc.actLines.step1Partner') }}</h5>
        <PartnersPart @setpartner="setPartner" />
      </div>
      <div class="col p-0 pr-4">
        <h5>{{ $t('getparc.actLines.billingAccount') }}</h5>
        <BillingAccountsPart
          :disabled="isPartnerMVNO"
          :partner="!isPartnerMVNO ? selectedPartner : undefined"
          @set:billingAccount="chosenBillingAccount = $event"
        />
      </div>
      <div class="col p-0 pr-4">
        <template v-if="statuses">
          <h5>{{ $t('status') }}</h5>
          <UiSelect class="text-gray" block v-model="selectedStatus" :options="statuses" />
        </template>
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
import UiSelect from '@/components/ui/UiSelect';

export default {
  components: {
    PrereqContainer,
    PartnersPart,
    BillingAccountsPart,
    UiSelect,
  },
  props: {
    userPartner: {
      type: Object,
      default: undefined,
    },
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
      statuses: undefined,
      selectedStatus: undefined,
    };
  },
  mounted() {
    if (this.userPartner) {
      this.selectedPartner = { ...this.userPartner };
    }
    this.statuses = [
      {
        value: 'NOT_PREACTIVATED',
        label: this.$t('getparc.actLines.simStatuses.NOT_PREACTIVATED'),
      },
      {
        value: 'PREACTIVATED',
        label: this.$t('getparc.actLines.simStatuses.PREACTIVATED'),
      },
      {
        value: 'ACTIVATED',
        label: this.$t('getparc.actLines.simStatuses.ACTIVATED'),
      },
    ];
  },
  computed: {
    canValidate() {
      if (this.isPartnerMVNO) {
        return !!this.selectedStatus;
      }
      return !this.isPartnerEmpty && !this.isChosenBillingAccountEmpty && !!this.selectedStatus;
    },
    isPartnerEmpty() {
      return !get(this.selectedPartner, 'id');
    },
    isChosenBillingAccountEmpty() {
      return !get(this.chosenBillingAccount, 'id');
    },
    isPartnerMVNO() {
      if (this.isPartnerEmpty) return;
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
      const selectedStatus = this.statuses.find((s) => this.selectedStatus === s.value);
      this.$emit('set:preprequisites', {
        partner: this.selectedPartner,
        billingAccount: this.chosenBillingAccount,
        selectedStatus: { id: selectedStatus.value, label: selectedStatus.label },
        search: true,
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
