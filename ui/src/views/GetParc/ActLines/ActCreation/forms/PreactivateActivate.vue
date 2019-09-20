<template>
  <ActFormContainer :validate-fn="doRequest">
    <div class="toggles-container">
      <UiToggle label="Préactivation" v-model="preActivation" :editable="false" />
      <UiToggle label="Activation" v-model="activation" />
    </div>
    <div>
      <label class="font-weight-bold">{{ $t('col.offer') }}</label>
      <OffersPart :partner="partner" :offer.sync="selectedOffer" />
    </div>
    <div>
      <PartnerBillingAccountChoice
        :key="actCreationPrerequisites.partner.id"
        @set:billingAccount="setBillingAccount"
        :errors="errors"
        :initial-parnter="actCreationPrerequisites.partner"
        :limit-to-partners-in-search-bar="limitToPartnersInSearchBar"
      ></PartnerBillingAccountChoice>
    </div>
    <div v-if="selectedOffer && selectedOffer.data">
      <ServicesBlock
        :offer="selectedOffer.data"
        @barringChange="barringServices = $event"
        @normalChange="normalServices = $event"
        @dataChange="dataService = $event"
      />
    </div>
    <label class="font-weight-bold">{{ $t('common.customFields') }}</label>
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

import ServicesBlock from '@/components/Services/ServicesBlock';

import PartnerBillingAccountChoice from './parts/PartnerBillingAccountChoice';

import Modal from '@/components/Modal';
import CircleLoader from '@/components/ui/CircleLoader';

import { preactivateAndActivateSImcardInstance } from '@/api/actCreation';

export default {
  components: {
    ActFormContainer,
    UiToggle,
    OffersPart,
    ServicesBlock,
    CustomFields,
    PartnerBillingAccountChoice,
    Modal,
    CircleLoader,
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
      barringServices: [],
      normalServices: [],
      dataService: undefined,
      isLoading: false,
      waitForReportConfirmation: false,
    };
  },

  mounted() {
    this.loadCustomFields();
  },

  watch: {
    activation() {
      this.decideOnMandatoryCustomFields();
    },
  },

  methods: {
    async doRequest(contextValues) {
      const response = await this.doPreactivate(contextValues);
      return response;
    },

    async doPreactivate(contextValues) {
      const params = {
        partyId: this.actCreationPrerequisites.partner.id,
        dueDate: contextValues.actDate,
        notifEmail: contextValues.notificationCheck,
        offer: this.selectedOffer.data.initialOffer.code,
        barringServices: this.barringServices,
        dataService: this.dataService,
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
