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
        <BillingAccountAutocomplete
          v-model="newSelectedBillingAccount"
          :selected-partner="lineData.party"
          preselect-first-only-when-one-item
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
import { changeSingleCustomerAccount } from '@/api/actCreation';
import BillingAccountAutocomplete from '@/components/CustomComboxes/BillingAccountAutocomplete.vue';

export default {
  components: {
    BaseForm,
    FormReport,
    BillingAccountAutocomplete,
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
    };
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
  },

  computed: {
    currentBillingAccount() {
      const code = get(this.lineData, 'accessPoint.offerGroup.customerAccount.code');
      const name = get(this.lineData, 'accessPoint.offerGroup.customerAccount.name');
      return `${code} - ${name}`;
    },

    idCurrentBillingAccount() {
      return get(this.lineData, 'accessPoint.offerGroup.customerAccount.id');
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
