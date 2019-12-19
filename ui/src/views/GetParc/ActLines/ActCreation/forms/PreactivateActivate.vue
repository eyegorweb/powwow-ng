<template>
  <ActFormContainer :validate-fn="doRequest">
    <div class="toggles-container">
      <UiToggle label="Préactivation" v-model="preActivation" :editable="false" />
      <UiToggle label="Activation" v-model="activation" />
    </div>
    <div v-if="activation">
      <label class="font-weight-bold">{{ $t('col.offer') }}</label>
      <OffersPart :partner="partner" :offer.sync="selectedOffer" />
    </div>
    <div>
      <BillingAccountChoice
        :key="actCreationPrerequisites.partner.id"
        :partner-id="actCreationPrerequisites.partner.id"
        @set:billingAccount="setBillingAccount"
        :errors="errors"
      />
    </div>
    <div v-if="selectedOffer && selectedOffer.data">
      <ServicesBlock
        v-if="selectedOffer"
        :key="selectedOffer.label"
        :services="offerServices"
        vertical
        @change="onServiceChange"
      />
    </div>
    <label v-if="activation && selectedOffer && selectedOffer.data" class="font-weight-bold">{{
      $t('common.customFields')
    }}</label>
    <div>
      <CustomFields
        :fields="allCustomFields"
        :get-selected-value="getSelectedValue"
        :errors="customFieldsErrors"
        show-optional-field
        @change="onValueChanged"
      />
    </div>
  </ActFormContainer>
</template>

<script>
import UiToggle from '@/components/ui/UiToggle';
import OffersPart from '@/views/GetParc/ActLines/ActCreation/prerequisites/parts/OffersPart';
import CustomFields from '@/components/CustomFields';

import { mapState, mapGetters } from 'vuex';
import { fetchCustomFields } from '@/api/customFields';

import ActFormContainer from './parts/ActFormContainer2';
import BillingAccountChoice from './parts/BillingAccountChoice';

import {
  preactivateAndActivateSImcardInstance,
  preactivateSimCardInstance,
} from '@/api/actCreation';
import ServicesBlock from '@/components/Services/ServicesBlock.vue';

import { getMarketingOfferServices } from '@/components/Services/utils.js';

export default {
  components: {
    ActFormContainer,
    UiToggle,
    OffersPart,
    CustomFields,
    BillingAccountChoice,
    ServicesBlock,
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
    ...mapGetters(['userName']),

    partner() {
      return this.actCreationPrerequisites.partner;
    },
  },
  data() {
    return {
      limitToPartnersInSearchBar: true,
      activation: false,
      preActivation: true,
      selectedOffer: undefined,
      customFieldsErrors: undefined,
      allCustomFields: [],
      customFieldsValues: [],
      chosenBillingAccount: undefined,
      errors: {},
      isLoading: false,
      waitForReportConfirmation: false,
      offerServices: undefined,
      servicesChoice: undefined,
    };
  },

  mounted() {
    this.loadCustomFields();
  },

  watch: {
    selectedOffer(selectedOffer) {
      if (selectedOffer)
        this.offerServices = getMarketingOfferServices(selectedOffer.data.initialOffer);
    },
    activation() {
      this.decideOnMandatoryCustomFields();
      this.offerServices = undefined;
      this.selectedOffer = undefined;
    },
  },

  methods: {
    onServiceChange(servicesChoice) {
      this.servicesChoice = servicesChoice;
      this.offerServices = [...servicesChoice.services, servicesChoice.dataService];
    },

    async doRequest(contextValues) {
      const params = {
        partyId: this.actCreationPrerequisites.partner.id,
        dueDate: contextValues.actDate,
        notifEmail: contextValues.notificationCheck,
        workflowCode: this.selectedOffer ? this.selectedOffer.id : undefined,
        servicesChoice: this.servicesChoice,
        customerAccountID: this.chosenBillingAccount.id,
        tempDataUuid: contextValues.tempDataUuid,
      };
      if (this.activation) {
        return await preactivateAndActivateSImcardInstance(
          this.appliedFilters,
          this.selectedLinesForActCreation,
          params
        );
      } else {
        return await preactivateSimCardInstance(
          this.appliedFilters,
          this.selectedLinesForActCreation,
          params
        );
      }
    },

    async confirmValdation(containerValidationFn) {
      if (!this.checkErrors()) {
        this.isLoading = true;
        const response = await containerValidationFn();
        this.isLoading = false;
        this.waitForReportConfirmation = false;
        return response;
      }
      this.waitForReportConfirmation = false;
    },
    checkErrors() {},

    setBillingAccount(billingAccount) {
      this.chosenBillingAccount = billingAccount;
    },

    async loadCustomFields() {
      this.allCustomFields = await fetchCustomFields(this.actCreationPrerequisites.partner.id);
      this.decideOnMandatoryCustomFields();
    },

    decideOnMandatoryCustomFields() {
      this.allCustomFields = this.allCustomFields.map(c => {
        c.isOptional = true;
        if (this.activation && c.mandatory === 'ACTIVATION') {
          c.isOptional = false;
        }
        return c;
      });
    },

    getSelectedValue(code) {
      const existingFieldValue = this.customFieldsValues.find(c => c.code === code);
      if (existingFieldValue) {
        return existingFieldValue.enteredValue;
      }
    },

    onValueChanged(customField, enteredValue) {
      const existingFieldValue = this.customFieldsValues.find(c => c.code === customField.code);
      if (existingFieldValue) {
        this.customFieldsValues = this.customFieldsValues.map(c => {
          if (c.code === customField.code) {
            return {
              ...c,
              enteredValue,
            };
          }
          return c;
        });
      } else {
        customField.enteredValue = enteredValue;
        this.customFieldsValues = [...this.customFieldsValues, { ...customField }];
      }
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
</style>
