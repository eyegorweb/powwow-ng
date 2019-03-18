<template>
  <div class="step-client-container">
    <div class="panel-vertical-container">
      <div class="main-content">
        <h2 class="panel-title">{{ $t('orders.choose-partner') }}</h2>

        <div>
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
          <h2 class="panel-title">{{ $t('orders.choose-account') }}</h2>
          <UiApiAutocomplete
            :items="billingAccounts"
            v-model="selectedBillingAccount"
            display-results-while-empty
          />
        </div>
      </div>
      <div class="footer-back">
        <UiButton
          variant="round-button"
          @click="done"
          :disabled="!canGoToNextStep"
          class="float-right ic-Arrow-Next-Icon"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import UiButton from '@/components/ui/Button';
import { fetchpartners } from '@/api/partners';
import { fetchBillibAccountForPartnerId } from '@/api/billingAccounts';
import get from 'lodash.get';

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
    }
  },

  methods: {
    async fetchPartners(q, page = 0) {
      const data = await fetchpartners(q, { page, limit: 10 });
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
        label: ba.name,
        partnerId: ba.party.id,
      }));
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
    UiButton,
  },
};
</script>

<style lang="scss" scoped>
.step-client-container {
  padding: 0 2rem;

  @media screen and (min-width: 1440px) {
    padding: 0 7rem;
  }
}

.subcontainer {
  width: 65%;
  margin: 0 auto;
}
</style>
