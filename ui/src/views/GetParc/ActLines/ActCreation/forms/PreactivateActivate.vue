<template>
  <ActFormContainer :validate-fn="doRequest" :check-errors-fn="haveFieldErrors">
    <template v-if="partner">
      <div class="toggles-container">
        <UiToggle label="Préactivation" v-model="preActivation" :editable="false" />
        <UiToggle label="Activation" v-model="activation" />
      </div>

      <template v-if="activation">
        <div>
          <label class="font-weight-bold">
            {{ $t('common.billingAccount') }}
            <!-- Ajouter getstionnaire erreur CF sélectionné ou pas -->
            <div class="text-danger" v-if="fieldErrors && fieldErrors.billingAccount">
              {{ $t('required') }}
            </div>
          </label>
          <BillingAccountsPart
            :key="`billingAccount_${partner}`"
            :partner="partner"
            :offer.sync="selectedOffer"
            @set:billingAccount="setBillingAccount"
            :preselect-billing-account="preselectBillingAccount"
            :disabled="!!preselectBillingAccount && partner.partyType !== 'MVNO'"
          />
        </div>
        <div>
          <label class="font-weight-bold">
            {{ $t('col.offer') }}
            <div class="text-danger" v-if="fieldErrors && fieldErrors.offer">
              {{ $t('required') }}
            </div>
          </label>
          <OffersPart :partner="partner" :offer.sync="selectedOffer" />
        </div>

        <div v-if="selectedOffer && selectedOffer.data">
          <ServicesBlock
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
          <PartnerFields
            :custom-fields="allCustomFields"
            :get-selected-value="getSelectedValue"
            :errors="customFieldsErrors"
            show-optional-field
            @change="onValueChanged"
          />
        </div>
      </template>
    </template>
  </ActFormContainer>
</template>

<script>
import UiToggle from '@/components/ui/UiToggle';
import OffersPart from '@/views/GetParc/ActLines/ActCreation/prerequisites/parts/OffersPart';
import BillingAccountsPart from '@/views/GetParc/ActLines/ActCreation/prerequisites/parts/BillingAccountsPart';
import PartnerFields from '@/components/PartnerFields';

import { mapState, mapGetters } from 'vuex';
import { fetchCustomFields } from '@/api/customFields';

import ActFormContainer from './parts/ActFormContainer2';

import {
  preactivateAndActivateSImcardInstance,
  preactivateSimCardInstance,
} from '@/api/actCreation';
import ServicesBlock from '@/components/Services/ServicesBlock.vue';

import { getMarketingOfferServices } from '@/components/Services/utils.js';
import { searchLineById } from '@/api/linesActions';

export default {
  components: {
    ActFormContainer,
    UiToggle,
    OffersPart,
    BillingAccountsPart,
    PartnerFields,
    ServicesBlock,
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters', 'linesActionsResponse']),
    ...mapGetters(['userName']),

    partner() {
      if (this.actCreationPrerequisites.searchById) {
        if (this.singleLineFound) {
          return this.singleLineFound.party;
        }
      }
      return this.actCreationPrerequisites.partner;
    },
    preselectBillingAccount() {
      if (this.partner.partyType === 'MVNO') {
        return this.chosenBillingAccount;
      }
      return this.billingAccount;
    },

    billingAccount() {
      if (this.actCreationPrerequisites.searchById) {
        if (this.singleLineFound) {
          return this.singleLineFound.customerAccountForActivation;
        }
      }
      return this.actCreationPrerequisites.billingAccount;
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
      errors: {},
      fieldErrors: undefined,
      isLoading: false,
      waitForReportConfirmation: false,
      offerServices: undefined,
      servicesChoice: undefined,
      chosenBillingAccount: undefined,
      singleLineFound: undefined,
    };
  },

  async mounted() {
    await this.loadSingleLineInfo();
    this.loadCustomFields();
  },

  watch: {
    selectedOffer(selectedOffer) {
      if (selectedOffer && selectedOffer.data)
        this.offerServices = getMarketingOfferServices(selectedOffer.data.initialOffer);
    },
    activation(newValue) {
      this.decideOnMandatoryCustomFields();
      this.offerServices = undefined;
      this.selectedOffer = undefined;
      this.chosenBillingAccount = undefined;

      if (!newValue) {
        this.selectedOffer = undefined;
      }
    },
  },

  methods: {
    async loadSingleLineInfo() {
      if (
        this.actCreationPrerequisites.searchById &&
        this.linesActionsResponse &&
        this.linesActionsResponse.total === 1
      ) {
        const lineInTable = this.linesActionsResponse.items[0];
        this.singleLineFound = await searchLineById(lineInTable.id);
      }
    },
    setBillingAccount(billingAccount) {
      this.chosenBillingAccount = billingAccount;
    },

    onServiceChange(servicesChoice) {
      this.servicesChoice = servicesChoice;
      this.offerServices = [...servicesChoice.services, servicesChoice.dataService];
    },

    haveFieldErrors() {
      const fieldErrors = {};
      let haveError = false;
      if (this.activation) {
        console.log(
          'haveFieldErrors -> this.preselectBillingAccount',
          this.preselectBillingAccount
        );
        if (!this.preselectBillingAccount || !this.preselectBillingAccount.id) {
          fieldErrors.billingAccount = true;
          haveError = true;
        }
        if (!this.selectedOffer || !this.selectedOffer.data) {
          fieldErrors.offer = true;
          haveError = true;
        }
      }

      this.fieldErrors = fieldErrors;
      return haveError;
    },

    async doRequest(contextValues) {
      let params;
      if (this.activation) {
        params = {
          partyId: this.partner.id,
          dueDate: contextValues.actDate,
          notifEmail: contextValues.notificationCheck,
          workflowCode: this.selectedOffer ? this.selectedOffer.id : undefined,
          servicesChoice: this.servicesChoice,
          customerAccountID: this.billingAccount
            ? this.billingAccount.id
            : this.preselectBillingAccount.id,
          tempDataUuid: contextValues.tempDataUuid,
        };

        return await preactivateAndActivateSImcardInstance(
          this.appliedFilters,
          this.selectedLinesForActCreation,
          params
        );
      } else {
        params = {
          partyId: this.partner.id,
          dueDate: contextValues.actDate,
          notifEmail: contextValues.notificationCheck,
          customerAccountID:
            this.partner.partyType === 'CUSTOMER' && this.billingAccount
              ? this.billingAccount.id
              : null,
          tempDataUuid: contextValues.tempDataUuid,
        };

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
    checkErrors() { },

    async loadCustomFields() {
      this.allCustomFields = await fetchCustomFields(this.partner.id);
      this.decideOnMandatoryCustomFields();
    },

    decideOnMandatoryCustomFields() {
      if (this.allCustomFields && this.allCustomFields.customFields) {
        this.allCustomFields = this.allCustomFields.customFields.map(c => {
          c.isOptional = true;
          if (this.activation && c.mandatory === 'ACTIVATION') {
            c.isOptional = false;
          }
          return c;
        });
      }
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

.text-danger {
  font-size: 0.7rem;
  font-weight: 500;
}
</style>
