<template>
  <BaseForm
    :warning-msg="warningMessage"
    :validate-fn="doRequest"
    :can-send="canSend"
    :change-offer="true"
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
          v-model="selectedOffer"
          display-results-while-empty
        />
      </p>

      <div v-if="selectedOffer && selectedOffer.label">
        <ServicesBlock
          v-if="selectedOffer"
          :key="selectedOffer.label"
          :services="offerServices"
          :initial-services="initialServices"
          :offer="selectedOffer"
          vertical
          @servicechange="onServiceChange"
        />
      </div>
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
import ServicesBlock from '@/components/Services/ServicesBlock.vue';
import { fetchOffers } from '@/api/offers';
import { changeSingleOffer } from '@/api/actCreation';
import { getMarketingOfferServices } from '@/components/Services/utils.js';
import get from 'lodash.get';
import cloneDeep from 'lodash.clonedeep';

export default {
  components: {
    BaseForm,
    FormReport,
    UiApiAutocomplete,
    ServicesBlock,
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
      selectedOffer: undefined,
      currentWorkflowId: undefined,
      offerServices: undefined,
      initialServices: undefined,
      servicesChoice: undefined,
    };
  },

  methods: {
    onServiceChange(servicesChoice) {
      this.servicesChoice = servicesChoice;
      this.offerServices = [...servicesChoice.services, servicesChoice.dataService];
    },
    async doRequest(context) {
      const { notificationCheck, actDate } = context;
      const params = {
        notifEmail: notificationCheck,
        dueDate: actDate,
        partyId: this.lineData.party.id,
        simCardInstanceId: this.lineData.id,
        customerAccountID: this.lineData.accessPoint.offerGroup.customerAccount.id,
        sourceWorkflowID: this.lineData.workflow.id,
        targetWorkflowID: this.selectedOffer.data.id,
        servicesChoice: this.servicesChoice,
      };

      const response = await changeSingleOffer(params);

      // gestion temporaire des des erreurs LV
      if (response && response.errors) {
        response.errors = response.errors.map((e) => {
          const formatted = { ...e };
          if (
            e.extensions &&
            (e.extensions.sourceWorkflowID === 'LONG_LIFE_NOT_ALLOWED' ||
              e.extensions.targetWorkflowID === 'LONG_LIFE_NOT_ALLOWED')
          ) {
            formatted.message = this.$t(
              'getparc.actCreation.report.errors.workflow.LONG_LIFE_NOT_ALLOWED'
            );
          }
          return formatted;
        });
      }
      if (response) {
        return { report: { ...response.data.changeOfferV2 }, errors: response.errors };
      }
    },

    async fetchApi() {
      const billingAccountCode = this.$loGet(
        this.lineData,
        'accessPoint.offerGroup.customerAccount.code'
      );
      const data = await fetchOffers('', [{ id: this.lineData.party.id }], {
        page: 0,
        limit: 99,
        disabledOffer: true,
        customerAccountCode: billingAccountCode,
      });
      if (data) {
        return data
          .filter((o) => o.id !== this.lineData.workflow.id)
          .map((o) => ({
            id: o.code,
            label: o.workflowDescription,
            data: o,
            productCode: o.code,
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
      if (this.selectedOffer && this.selectedOffer.id) return true;
      return false;
    },

    changedServices() {
      if (!this.offerServices) return [];
      return this.offerServices.filter((s) => {
        const initialService = this.initialServices.find((os) => os.code === s.code);
        return initialService.checked !== s.checked;
      });
    },
    listAutoServiceMandatory() {
      if (!this.changedServices) return [];
      return this.changedServices
        .filter((s) => s.checked && !s.isClicked)
        .map((s) => s.labelService);
    },
    listAutoServiceIncompatible() {
      if (!this.changedServices) return [];
      return this.changedServices
        .filter((s) => !s.checked && !s.isClicked)
        .map((s) => s.labelService);
    },
    warningMessage() {
      let list = '',
        newLine = '';
      let message = '';
      if (this.listAutoServiceMandatory.length > 0) {
        list += `${this.$t(
          'services.listAutoServiceMandatory'
        )}: ${this.listAutoServiceMandatory.map((s) => s).join(',')}`;
      }
      if (this.listAutoServiceIncompatible.length > 0) {
        if (this.listAutoServiceMandatory.length) {
          newLine = '<br />';
        }
        list += `${newLine}${this.$t(
          'services.listAutoServiceIncompatible'
        )}: ${this.listAutoServiceIncompatible.map((s) => s).join(',')}`;
      }
      if (!list) {
        message = `${this.$t('getparc.actCreation.changeOffer.confirmAction')}`;
      } else {
        message = `${this.$t('getparc.actCreation.changeOffer.confirmationWarning', {
          list,
        })}`;
      }
      return message;
    },
  },

  watch: {
    selectedOffer(selectedOffer) {
      if (selectedOffer && selectedOffer.data) {
        this.offerServices = getMarketingOfferServices(selectedOffer.data.initialOffer);
        this.initialServices = cloneDeep(this.offerServices);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
