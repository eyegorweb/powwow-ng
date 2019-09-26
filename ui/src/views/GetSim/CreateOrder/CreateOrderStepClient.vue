<template>
  <CreateOrderStepContainer no-previous-button @done="done" :can-go-to-next-step="canGoToNextStep">
    <div class="main-content">
      <div v-if="!userIsPartner">
        <h3 class="font-weight-light text-center mt-4 mb-4">{{ $t('orders.choose-partner') }}</h3>

        <UiApiAutocomplete
          :api-method="fetchPartners"
          v-model="selectedPartner"
          display-results-while-empty
          scroll-for-next
        >
          <img
            style="font-size: 24px"
            class="arrow"
            src="@/assets/search.svg"
            :style="{ left: 0 }"
          />
        </UiApiAutocomplete>
      </div>
      <div>
        <h3 class="font-weight-light text-center mt-4 mb-4">{{ $t('orders.choose-account') }}</h3>
        <UiApiAutocomplete
          :items="billingAccounts"
          v-model="selectedBillingAccount"
          display-results-while-empty
        />
      </div>
    </div>
  </CreateOrderStepContainer>
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import CreateOrderStepContainer from './CreateOrderStepContainer';
import { fetchpartners } from '@/api/partners';
import { fetchBillibAccountForPartnerId } from '@/api/billingAccounts';
import get from 'lodash.get';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'CreateOrderStepClient',

  data() {
    return {
      billingAccounts: [],
      selectedPartner: null,
      selectedBillingAccount: null,
    };
  },

  props: {
    synthesis: {
      type: Object,
      required: true,
    },
    order: Object,
  },

  mounted() {
    if (
      this.synthesis &&
      this.synthesis.billingAccount &&
      this.synthesis.billingAccount.selection
    ) {
      this.selectedPartner = this.synthesis.billingAccount.selection.partner;
      this.selectedBillingAccount = this.synthesis.billingAccount.selection.billingAccount;
    } else if (this.order) {
      this.preFill();
    } else if (this.userIsPartner) {
      this.selectedPartner = this.userInfos.party;
    }
  },

  methods: {
    async fetchPartners(q, page = 0) {
      if (this.contextPartners && this.contextPartners.length) {
        return this.contextPartners;
      }
      const partnerTypesIn = this.contextPartnersTypes;
      const data = await fetchpartners(q, { page, limit: 10, partnerTypesIn });
      return data.map(p => ({
        id: p.id,
        label: p.name,
        orderNumberIsMandatory: p.orderNumberRequired,
      }));
    },
    done() {
      this.$emit('done', {
        billingAccount: {
          label: 'common.billingAccount',
          value: {
            id: this.selectedBillingAccount.id,
            content: this.selectedBillingAccount.label,
            partnerId: this.selectedPartner.id,
          },
          selection: {
            billingAccount: this.selectedBillingAccount,
            partner: this.selectedPartner,
          },
        },
      });
    },

    /**
     * Pré remplir les champs si on est dans une duplication de commande
     */
    preFill() {
      this.$emit('saveSynthesis', {
        billingAccount: {
          label: 'common.billingAccount',
          value: {
            id: get(this.order, 'customerAccount.id'),
            content: get(this.order, 'customerAccount.name'),
            partnerId: get(this.order, 'party.id'),
          },
          selection: {
            billingAccount: {
              id: get(this.order, 'customerAccount.id'),
              label: get(this.order, 'customerAccount.name'),
              partnerId: get(this.order, 'party.id'),
              highlighted: get(this.order, 'customerAccount.name'),
            },
            partner: { id: get(this.order, 'party.id'), label: get(this.order, 'party.name') },
          },
        },
      });
    },
  },
  computed: {
    ...mapGetters(['userIsPartner', 'userInfos']),
    ...mapState('userContext', ['contextPartnersTypes', 'contextPartners']),

    canGoToNextStep() {
      if (this.selectedBillingAccount) {
        return this.selectedBillingAccount.label;
      }
      return this.selectedBillingAccount;
    },
  },

  watch: {
    async selectedPartner({ id }) {
      // NOTE: pendant que l'on tape, les valeurs sont remontes mais non validees. lorsque l'on click, on recupere la vrai valeur
      if (id == null) return;
      if (
        this.selectedBillingAccount &&
        this.selectedBillingAccount.partnerId !== this.selectedPartner.id
      ) {
        this.selectedBillingAccount = null;
      }

      const data = await fetchBillibAccountForPartnerId(id);
      this.billingAccounts = data.map(ba => ({
        id: ba.id,
        label: `${ba.code} - ${ba.name}`,
        partnerId: ba.party.id,
      }));

      if (this.billingAccounts && this.billingAccounts.length === 1) {
        this.selectedBillingAccount = this.billingAccounts[0];
      }
    },
    synthesis(synthesis) {
      if (synthesis) {
        this.selectedPartner = synthesis.billingAccount.selection.partner;
        this.selectedBillingAccount = synthesis.billingAccount.selection.billingAccount;
      }
    },
  },

  components: {
    UiApiAutocomplete,
    CreateOrderStepContainer,
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-height: 768px) {
  .panel-vertical-container {
    div.step-content {
      max-height: 87vh;
      min-height: 60vh !important;
    }
  }
}
@media screen and (min-height: 769px) {
  .panel-vertical-container {
    div.step-content {
      min-height: 60vh;
      max-height: 87vh;
    }
  }
}

.subcontainer {
  width: 65%;
  margin: 0 auto;
}
</style>
