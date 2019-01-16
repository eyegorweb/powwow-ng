<template>
  <div class="step-client-container">
    <div>
      <h2 class="title">{{ $t('orders.choose-partner') }}</h2>
      <UiApiAutocomplete
        :api-method="fetchPartners"
        v-model="selectedPartner"
        display-results-while-empty
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
        <UiCircularButton @click="done" :disabled="!canGoToNextStep" class="float-right">
          <span slot="icon" class="ic-Arrow-Next-Icon" />
        </UiCircularButton>
      </div>
    </div>
  </div>
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import UiCircularButton from '@/components/ui/UiCircularButton';
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
    async fetchPartners(q) {
      const data = await fetchpartners(q, { page: 0, limit: 10 });
      return data.map(p => ({
        id: p.id,
        label: p.name,
      }));
    },
    done() {
      this.$emit('client-step-done', {
        label: 'common.billingAccounts',
        value: {
          id: this.selectedBillingAccount.id,
          label: this.selectedBillingAccount.label,
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
    UiCircularButton,
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
  margin: 50px 0 30px;
  padding: 0;
  text-align: center;
}

.step-client-container {
  padding: 2em !important;
}
</style>
