<template>
  <CreateOrderStepContainer
    no-previous-button
    @done="done"
    :can-go-to-next-step="!!canGoToNextStep"
  >
    <div v-if="!userIsPartner">
      <h3 class="font-weight-light text-center mt-4 mb-4">{{ $t('orders.choose-partner') }}</h3>
      <PartnerCombo :value.sync="selectedPartner" esim />
    </div>

    <div>
      <h3 class="font-weight-light text-center mt-4 mb-4">{{ $t('orders.choose-account') }}</h3>
      <BillingAccountAutocomplete
        v-model="selectedBillingAccount"
        :partners="selectedPartner ? [selectedPartner] : undefined"
        preselect-first-only-when-one-item
      />
    </div>
  </CreateOrderStepContainer>
</template>

<script>
import CreateOrderStepContainer from '@/views/GetSim/CreateOrder/CreateOrderStepContainer.vue';
import PartnerCombo from '@/components/CustomComboxes/PartnerCombo.vue';
import BillingAccountAutocomplete from '@/components/CustomComboxes/BillingAccountAutocomplete.vue';

import { mapGetters } from 'vuex';
import { getPartyOptions } from '@/api/partners.js';

export default {
  components: {
    CreateOrderStepContainer,
    PartnerCombo,
    BillingAccountAutocomplete,
  },
  props: {
    synthesis: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedPartner: undefined,
      selectedBillingAccount: undefined,
    };
  },
  computed: {
    ...mapGetters(['userIsPartner', 'userInfos', 'singlePartner']),

    canGoToNextStep() {
      return this.selectedBillingAccount && this.selectedBillingAccount.id;
    },
  },
  mounted() {
    this.preFill();
  },
  methods: {
    preFill() {
      if (this.synthesis && this.synthesis.stepClient) {
        this.selectedPartner = this.synthesis.stepClient.partner;
        this.selectedBillingAccount = this.synthesis.stepClient.billingAccount;
      }

      if (this.userIsPartner && !this.selectedPartner) {
        this.selectedPartner = this.singlePartner;
      }
    },
    async done() {
      const partnerOptions = await getPartyOptions(this.$loGet(this.selectedPartner, 'id'));
      this.selectedPartner.options = partnerOptions;

      this.$emit('done', {
        stepClient: {
          partner: this.selectedPartner,
          billingAccount: this.selectedBillingAccount,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
