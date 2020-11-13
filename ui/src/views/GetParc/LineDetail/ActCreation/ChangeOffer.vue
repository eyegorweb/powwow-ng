<template>
  <BaseForm
    warning-msg="getparc.actCreation.changeOffer.confirmationWarning"
    :validate-fn="doRequest"
    :can-send="canSend"
  >
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actCreation.changeOffer.currentOffer') }} :</h6>
      <p>{{ currentOffer.description }}</p>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actCreation.changeOffer.chooseOffer') }} :</h6>
      <p>
        <UiApiAutocomplete
          :api-method="fetchApi"
          v-model="newSelectedOffer"
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
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import get from 'lodash.get';
import { fetchOffers } from '@/api/offers';
import { changeSingleOffer } from '@/api/actCreation';

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
      newSelectedOffer: undefined,
      currentWorkflowId: undefined,
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
        customerAccountID: this.lineData.accessPoint.offerGroup.customerAccount.id,
        sourceWorkflowID: this.currentWorkflowId,
        targetWorkflowID: this.newSelectedOffer.data.id,
      };

      const response = await changeSingleOffer(params);
      if (response) {
        return { report: { ...response.data.changeOfferV2 }, errors: response.errors };
      }
    },

    async fetchApi() {
      const data = await fetchOffers('', [{ id: this.lineData.party.id }], {
        page: 0,
        limit: 99,
        disabledOffer: true,
      });
      if (data) {
        let workflowId = data.find(o => o.code === this.currentOffer.code);
        if (!workflowId) return;
        this.currentWorkflowId = workflowId.id;
        return data
          .filter(o => o.code !== this.currentOffer.code)
          .map(o => ({
            id: o.code,
            label: o.workflowDescription,
            data: o,
            productCode: o.initialOffer.code,
          }));
      }
    },
  },

  computed: {
    currentOffer() {
      const code = get(this.lineData, 'accessPoint.offer.marketingOffer.code');
      let description = get(this.lineData, 'accessPoint.offer.marketingOffer.description');
      if (get(this.lineData, 'party.partyType') === 'MULTI_CUSTOMER') {
        description = get(this.lineData, 'workflow.workflowDescription');
      }
      return {
        description: `${description}`,
        code: `${code}`,
      };
    },

    canSend() {
      if (this.newSelectedOffer && this.newSelectedOffer.id) return true;
      return false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
