<template>
  <ActFormContainer2
    :validate-fn="doRequest"
    success-message="getparc.actCreation.changeOffer.successMessage"
    :check-errors-fn="checkErrors"
  >
    <BillingAccountChoice
      :key="actCreationPrerequisites.partner.id"
      :partner-id="actCreationPrerequisites.partner.id"
      @set:billingAccount="setBillingAccount"
      :errors="errors"
    />

    <template>
      <h6>{{ $t('getparc.actLines.selectOffer') }}</h6>
      <OffersPart
        :partner="actCreationPrerequisites.partner"
        :offer.sync="selectedOffer"
        :error="errors.offer"
      />
    </template>

    <div v-if="selectedOffer && selectedOffer.data" class="row">
      <div class="col-md-8 mb-3">
        <UiToggle
          label="Avec changement de services ?"
          v-model="canChangeServices"
          on-text="Oui"
          off-text="Non"
        />
      </div>
      <hr />
    </div>

    <div v-if="canChangeServices" class="toggles-container">
      <UiToggle label="Préactivation" v-model="preActivation" :editable="false" />
      <UiToggle label="Activation" v-model="activation" />
    </div>

    <div v-if="canChangeServices && activation">
      <ServicesBlock
        v-if="selectedOffer"
        :key="selectedOffer.label"
        :services="offerServices"
        :data-params-needed="isDataParamsError"
        vertical
        @change="onServiceChange"
      />
    </div>
  </ActFormContainer2>
</template>

<script>
import BillingAccountChoice from './parts/BillingAccountChoice';
import UiToggle from '@/components/ui/UiToggle';
import OffersPart from '@/views/GetParc/ActLines/ActCreation/prerequisites/parts/OffersPart';

import { mapState, mapGetters } from 'vuex';
import ActFormContainer2 from './parts/ActFormContainer2';
import { fetchOffers } from '@/api/offers';
import moment from 'moment';
import ServicesBlock from '@/components/Services/ServicesBlock.vue';

import { changeOffer } from '@/api/actCreation2';

import { getMarketingOfferServices } from '@/components/Services/utils.js';

export default {
  components: {
    UiToggle,
    BillingAccountChoice,
    ActFormContainer2,
    ServicesBlock,
    OffersPart,
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
    currentOffer() {
      return this.actCreationPrerequisites.offer.data.id;
    },
  },
  data() {
    return {
      offers: [],
      selectedOffer: undefined,
      chosenBillingAccount: undefined,
      actDate: null,
      errors: {},
      notificationCheck: false,
      canChangeDate: undefined,
      waitForConfirmation: false,
      limitToPartnersInSearchBar: true,
      activation: false,
      preActivation: true,

      offerServices: undefined,
      servicesChoice: undefined,
      canChangeServices: false,
      isDataParamsError: false,
    };
  },

  mounted() {
    // droits sur la date
    switch (this.actCreationPrerequisites.partner.partyType) {
      case 'MVNO':
        this.actDate = moment().format('DD/MM/YYYY');
        this.canChangeDate = false;
        break;
      case 'M2M':
        this.actDate = moment()
          .endOf('month')
          .format('DD/MM/YYYY');
        this.canChangeDate = false;
        break;
      default:
        this.actDate = moment().format('DD/MM/YYYY');
        this.canChangeDate = true;
    }
  },

  watch: {
    selectedOffer(selectedOffer) {
      if (selectedOffer && selectedOffer.data) {
        this.offerServices = getMarketingOfferServices(selectedOffer.data.initialOffer);
      }
    },
  },

  methods: {
    onServiceChange(servicesChoice) {
      this.servicesChoice = servicesChoice;
      this.offerServices = [...servicesChoice.services, servicesChoice.dataService];
    },
    setBillingAccount(billingAccount) {
      this.chosenBillingAccount = billingAccount;
      this.refreshOffers();
    },

    async refreshOffers() {
      if (!this.chosenBillingAccount) return;
      this.selectedOffer = undefined;
      this.offers = [];

      const data = await fetchOffers('', [this.chosenBillingAccount.partner], {
        page: 0,
        limit: 99,
      });
      if (data) {
        this.offers = data.map(o => ({
          id: o.id,
          code: o.code,
          label: o.workflowDescription,
        }));
      }
    },
    onActDateChange(value) {
      this.actDate = value;
    },
    async confirmValdation(containerValidationFn) {
      const response = await containerValidationFn();
      this.waitForConfirmation = false;
      return response;
    },
    checkErrors() {
      let isError = false;
      this.isDataParamsError = false;
      this.errors = {};
      if (this.chosenBillingAccount) {
        if (!this.chosenBillingAccount.partner) {
          this.errors.partner = 'errors.mandatory';
          isError = true;
        }
      } else {
        this.errors.billingAccount = 'errors.mandatory';
        this.errors.partner = 'errors.mandatory';
        isError = true;
      }

      if (!this.selectedOffer) {
        this.errors.offer = 'errors.mandatory';
        isError = true;
      }

      if (this.servicesChoice && this.servicesChoice.dataService) {
        this.isDataParamsError =
          this.servicesChoice.dataService &&
          this.servicesChoice.dataService.parameters &&
          this.servicesChoice.dataService.parameters.filter(p => p.selected).length === 0;
        isError = this.isDataParamsError;
      }

      return isError;
    },

    async doRequest(contextValues) {
      const params = {
        notifEmail: contextValues.notificationCheck,
        dueDate: contextValues.actDate,
        partyId: this.actCreationPrerequisites.partner.id,
        tempDataUuid: contextValues.tempDataUuid,
        servicesChoice: this.servicesChoice,
        customerAccountID: this.chosenBillingAccount.id,
        sourceWorkflowID: this.actCreationPrerequisites.offer.data.id,
        targetWorkflowID: this.selectedOffer.data.id,
      };
      return await changeOffer(this.appliedFilters, this.selectedLinesForActCreation, params);
    },
  },
};
</script>

<style lang="scss" scoped>
.toggles-container {
  flex-grow: 1;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  .toggle {
    flex: 1 100%;
    flex-grow: 1;
    margin-right: 1rem;
  }
}

.disabled {
  pointer-events: none;
  /deep/ .datepicker {
    background-color: $medium-gray;
  }
}
</style>
