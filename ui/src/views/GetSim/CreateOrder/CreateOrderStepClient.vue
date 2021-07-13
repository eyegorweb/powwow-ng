<template>
  <CreateOrderStepContainer
    no-previous-button
    @done="done"
    :can-go-to-next-step="!!canGoToNextStep"
  >
    <div class="main-content2">
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
            alt="search"
            :style="{ left: 0 }"
          />
        </UiApiAutocomplete>
      </div>
      <div v-if="canSeeBillingAccount">
        <h3 class="font-weight-light text-center mt-4 mb-4">{{ $t('orders.choose-account') }}</h3>
        <BillingAccountAutocomplete
          v-model="selectedBillingAccount"
          :selected-partner="selectedPartner"
          preselect-first-only-when-one-item
        />
      </div>
    </div>
  </CreateOrderStepContainer>
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import CreateOrderStepContainer from './CreateOrderStepContainer';
import BillingAccountAutocomplete from '@/components/CustomComboxes/BillingAccountAutocomplete.vue';
import { fetchpartners, fetchpartnerById, getPartyOptions } from '@/api/partners';

import get from 'lodash.get';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'CreateOrderStepClient',

  data() {
    return {
      billingAccounts: [],
      selectedPartner: null,
      selectedBillingAccount: null,
      canSeeBillingAccount: true,
    };
  },

  props: {
    synthesis: {
      type: Object,
      required: true,
    },
    order: Object,
  },

  async mounted() {
    if (
      this.synthesis &&
      this.synthesis.billingAccount &&
      this.synthesis.billingAccount.selection
    ) {
      this.selectedPartner = this.synthesis.billingAccount.selection.partner;
      this.canSeeBillingAccount = false;
      this.$nextTick(() => {
        this.selectedBillingAccount = this.synthesis.billingAccount.selection.billingAccount;
        this.canSeeBillingAccount = true;
      });
    } else if (this.order) {
      this.preFill();
    } else if (this.userIsPartner) {
      const partner = await fetchpartnerById(this.userInfos.partners[0].id);

      this.selectedPartner = {
        id: partner.id,
        label: partner.name,
      };
    }
  },

  methods: {
    async fetchPartners(q, page = 0) {
      if (this.contextPartners && this.contextPartners.length) {
        return this.contextPartners;
      }
      const data = await fetchpartners(q, {
        page,
        limit: 10,
        partnerType: this.contextPartnersType,
      });
      return data.map((p) => ({
        id: p.id,
        label: p.name,
      }));
    },
    async done() {
      const partnerOptions = await getPartyOptions(this.$loGet(this.selectedPartner, 'id'));
      this.selectedPartner.options = partnerOptions;
      const alreadyChosenBillingAccount = get(
        this.synthesis,
        'billingAccount.selection.billingAccount.id'
      );

      let synthesis = {
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
      };

      if (
        alreadyChosenBillingAccount &&
        alreadyChosenBillingAccount !== this.selectedBillingAccount.id
      ) {
        synthesis = { ...synthesis, services: {} };
      }

      this.$emit('done', {
        ...synthesis,
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
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),

    canGoToNextStep() {
      if (this.selectedBillingAccount) {
        return this.selectedBillingAccount.label;
      }
      return this.selectedBillingAccount;
    },
  },

  watch: {
    async selectedPartner(value) {
      if (!value) {
        this.selectedBillingAccount = null;
        this.billingAccounts = [];
        return;
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
    BillingAccountAutocomplete,
  },
};
</script>
