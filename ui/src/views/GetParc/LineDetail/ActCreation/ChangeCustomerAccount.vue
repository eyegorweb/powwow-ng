<template>
  <BaseForm
    warning-msg="getparc.actCreation.transfertCF.confirmationWarning"
    :validate-fn="doRequest"
    :can-send="canSend"
  >
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actCreation.transfertCF.currentBillingAccount') }} :</h6>
      <p>{{ currentBillingAccount }}</p>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actCreation.transfertCF.newBillingAccount') }} :</h6>
      <p>
        <UiApiAutocomplete
          :items="billingAccounts"
          v-model="newSelectedBillingAccount"
          display-results-while-empty
        />
      </p>
    </div>
    <div slot="after" slot-scope="{ report }">
      <FormReport v-if="report" :data="report" />
    </div>
  </BaseForm>
</template>

<script>
import BaseForm from './BaseForm';
import FormReport from './FormReport';
import get from 'lodash.get';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { fetchBillibAccountForPartnerId } from '@/api/billingAccounts';
import { changeSingleCustomerAccount } from '@/api/actCreation';

export default {
  components: {
    BaseForm,
    FormReport,
    UiApiAutocomplete,
  },

  props: {
    lineData: Object,
    errors: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {
      newSelectedBillingAccount: undefined,
      billingAccounts: [],
    };
  },

  mounted() {
    this.fetchBillingAccounts();
  },

  methods: {
    async doRequest(context) {
      const { notificationCheck, actDate } = context;

      const params = {
        notifEmail: notificationCheck,
        dueDate: actDate,
        partyId: this.lineData.party.id,
        simCardInstanceId: this.lineData.id,
        targetCustomerAccount: this.newSelectedBillingAccount.id,
      };
      const response = await changeSingleCustomerAccount(params);

      if (response) {
        return { report: { ...response.data.changeCustomerAccountV2 }, errors: response.errors };
      }
    },

    async fetchBillingAccounts() {
      const data = await fetchBillibAccountForPartnerId(this.lineData.party.id);
      this.billingAccounts = data.map(ba => ({
        id: ba.id,
        label: `${ba.code} - ${ba.name}`,
        partnerId: ba.party.id,
        partner: ba.party,
      }));
    },
  },

  computed: {
    currentBillingAccount() {
      const code = get(this.lineData, 'accessPoint.offerGroup.customerAccount.code');
      const name = get(this.lineData, 'accessPoint.offerGroup.customerAccount.name');
      return `${code} - ${name}`;
    },

    canSend() {
      if (this.newSelectedBillingAccount && this.newSelectedBillingAccount.id) return true;
      return false;
    },
  },

  watch: {
    newSelectedBillingAccount(newValue) {
      this.$emit('set:billingAccount', newValue);
    },
  },
};
</script>

<style lang="scss" scoped></style>
