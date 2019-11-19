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
    <label v-if="activation && selectedOffer && selectedOffer.data" class="font-weight-bold">
      {{ $t('common.customFields') }}
    </label>
    <div>
      <CustomFields
        :fields="allCustomFields"
        :get-selected-value="getSelectedValue"
        :errors="customFieldsErrors"
        show-optional-field
        @change="onValueChanged"
      />
    </div>
    <div
      slot="validate-btn-content"
      slot-scope="{ containerValidationFn, actDate, notificationCheck }"
    >
      <button @click="waitForReportConfirmation = true" class="btn btn-primary pl-4 pr-4 pt-2 pb-2">
        <i class="ic-Edit-Icon" />
        {{ $t('getparc.actCreation.changeService.validateBtn') }}
      </button>

      <Modal v-if="waitForReportConfirmation">
        <div slot="body">
          <div class="text-danger">
            <i class="ic-Alert-Icon"></i>
            {{ $t('getparc.actCreation.preactivateActivate.confirmationWarning') }}
          </div>
        </div>
        <div slot="footer">
          <button
            class="modal-default-button btn btn-danger btn-sm"
            v-if="!isLoading"
            @click.stop="waitForReportConfirmation = false"
          >
            {{ $t('cancel') }}
          </button>
          <button
            class="modal-default-button btn btn-success btn-sm ml-1"
            v-if="!isLoading"
            @click.stop="confirmValdation(containerValidationFn, actDate, notificationCheck)"
          >
            {{ $t('save') }}
          </button>
          <button class="modal-default-button btn btn-light btn-sm ml-1" disabled v-if="isLoading">
            {{ $t('processing') }}
            <CircleLoader />
          </button>
        </div>
      </Modal>
    </div>
  </ActFormContainer>
</template>

<script>
import UiToggle from '@/components/ui/UiToggle';
import OffersPart from '@/views/GetParc/ActLines/ActCreation/prerequisites/parts/OffersPart';
import CustomFields from '@/components/CustomFields';

import { mapState, mapGetters } from 'vuex';
import { fetchCustomFields } from '@/api/customFields';

import ActFormContainer from './parts/ActFormContainer';
import BillingAccountChoice from './parts/BillingAccountChoice';
import Modal from '@/components/Modal';
import CircleLoader from '@/components/ui/CircleLoader';

import { preactivateAndActivateSImcardInstance } from '@/api/actCreation2';
import ServicesBlock from '@/components/Services/ServicesBlock.vue';

import { getMarketingOfferServices } from '@/components/Services/utils.js';

export default {
  components: {
    ActFormContainer,
    UiToggle,
    OffersPart,
    CustomFields,
    BillingAccountChoice,
    Modal,
    CircleLoader,
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
      const response = await this.doPreactivate(contextValues);
      return response;
    },

    async doPreactivate(contextValues) {
      const params = {
        partyId: this.actCreationPrerequisites.partner.id,
        dueDate: contextValues.actDate,
        notifEmail: contextValues.notificationCheck,
        workflowCode: this.selectedOffer ? this.selectedOffer.id : undefined,
        servicesChoice: this.servicesChoice,
        customerAccountID: this.chosenBillingAccount.id,
        tempDataUuid: contextValues.tempDataUuid,
      };
      return await preactivateAndActivateSImcardInstance(
        this.appliedFilters,
        this.selectedLinesForActCreation,
        params
      );
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
