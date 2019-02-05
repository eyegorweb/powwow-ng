<template>
  <div class="step-client-container">
    <div>
      <h2 class="title">{{ $t('orders.choose-partner') }}</h2>
      <UiApiAutocomplete
        :api-method="fetchPartners"
        v-model="selectedPartner"
        display-results-while-empty
        scroll-for-next
      >
        <img style="font-size: 24px" class="arrow" src="@/assets/search.svg" :style="{ left: 0 }">
      </UiApiAutocomplete>
    </div>
    <div>
      <h2 class="title">{{ $t('orders.choose-account') }}</h2>
      <UiApiAutocomplete
        :items="billingAccounts"
        v-model="selectedBillingAccount"
        display-results-while-empty
      />
    </div>

    <div class="row">
      <div class="col-md-12 mt-5">
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

export default {
  name: 'CreateOrderStepClient',

  data() {
    return {
      billingAccounts: [],
      selectedPartner: null,
      selectedBillingAccount: null,
    };
  },

  methods: {
    async fetchPartners(q, page = 0) {
      const data = await fetchpartners(q, { page, limit: 10 });
      return data.map(p => ({
        id: p.id,
        label: p.name,
      }));
    },
    done() {
      this.$emit('done', {
        billingAccount: {
          label: 'common.billingAccount',
          value: {
            id: this.selectedBillingAccount.id,
            content: this.selectedBillingAccount.label,
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
  },

  components: {
    UiApiAutocomplete,
    UiButton,
  },
};
</script>

<style lang="scss" scoped>
/* voir comment gérer le css en double */
.title {
  background-color: transparent;
  color: $dark-gray;
  font-weight: 300;
  font-size: 2rem;
  margin: 3rem 0 1.875rem;
  padding: 0;
  text-align: center;
}

.step-client-container {
  padding: 0 2rem !important;
}

.subcontainer {
  width: 65%;
  margin: 0 auto;
}
</style>
