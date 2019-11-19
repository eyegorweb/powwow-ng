<template>
  <ActFormEmptyContainer
    :validate-fn="validate"
    success-message="getparc.actCreation.changeOffer.successMessage"
    :check-errors-fn="checkErrors"
  >
    <div slot="main" slot-scope="{ containerValidationFn }">
      <BillingAccountChoice
        :key="actCreationPrerequisites.partner.id"
        :partner-id="actCreationPrerequisites.partner.id"
        @set:billingAccount="setBillingAccount"
        :errors="errors"
      />

      <template>
        <h6>{{ $t('getparc.actLines.selectOffer') }}</h6>
        <OffersPart :partner="actCreationPrerequisites.partner" :offer.sync="selectedOffer" />
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
          vertical
          @change="onServiceChange"
        />
      </div>
      <template v-if="selectedOffer && selectedOffer.data">
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
      </template>

      <div class="col d-flex">
        <UiCheckbox v-model="notificationCheck" />
        <span>{{ $t('getparc.actCreation.NOTIFICATION_CHECK') }}</span>
      </div>

      <div class="row">
        <div class="col">
          <UiDate
            @change="onActDateChange"
            :value="actDate"
            fixed
            :class="{ disabled: !canChangeDate }"
          >
            <i slot="icon" class="select-icon ic-Flag-Icon" />
          </UiDate>
        </div>
        <div class="col">
          <button @click="waitForConfirmation = true" class="btn btn-primary pl-4 pr-4 pt-2 pb-2">
            <span>
              <i class="ic-Shuffle-Icon"></i>
              {{ $t('getparc.actCreation.changeOffer.validateButton') }}
            </span>
          </button>
        </div>
      </div>
      <Modal v-if="waitForConfirmation">
        <div slot="body">
          <div class="text-danger">
            <i class="ic-Alert-Icon"></i>
            {{ $t('getparc.actCreation.changeOffer.confirmationWarning') }}
          </div>
        </div>
        <div slot="footer">
          <button
            class="modal-default-button btn btn-danger btn-sm"
            @click.stop="waitForConfirmation = false"
          >
            {{ $t('cancel') }}
          </button>
          <button
            class="modal-default-button btn btn-success btn-sm ml-1"
            @click.stop="confirmValdation(containerValidationFn)"
          >
            {{ $t('save') }}
          </button>
        </div>
      </Modal>
    </div>
  </ActFormEmptyContainer>
</template>

<script>
import BillingAccountChoice from './parts/BillingAccountChoice';
import UiToggle from '@/components/ui/UiToggle';
import OffersPart from '@/views/GetParc/ActLines/ActCreation/prerequisites/parts/OffersPart';

import { mapState, mapGetters } from 'vuex';
import ActFormEmptyContainer from './parts/ActFormEmptyContainer';
import UiDate from '@/components/ui/UiDate';
import UiCheckbox from '@/components/ui/Checkbox';
import { fetchOffers } from '@/api/offers';
import moment from 'moment';
import Modal from '@/components/Modal';
import ServicesBlock from '@/components/Services/ServicesBlock.vue';
import CustomFields from '@/components/CustomFields';

import { changeOffer } from '@/api/offers';
import { fetchCustomFields } from '@/api/customFields';

import { getMarketingOfferServices } from '@/components/Services/utils.js';

export default {
  components: {
    UiToggle,
    BillingAccountChoice,
    ActFormEmptyContainer,
    UiDate,
    UiCheckbox,
    Modal,
    ServicesBlock,
    CustomFields,
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

      customFieldsErrors: undefined,
      allCustomFields: [],
      customFieldsValues: [],
      offerServices: undefined,
      servicesChoice: undefined,
      canChangeServices: false,
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

    this.loadCustomFields();
  },

  watch: {
    selectedOffer(selectedOffer) {
      if (selectedOffer)
        this.offerServices = getMarketingOfferServices(selectedOffer.data.initialOffer);
    },
    activation() {
      this.decideOnMandatoryCustomFields();
    },
  },

  methods: {
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
      return isError;
    },
    async validate() {
      const params = {
        partyId: this.actCreationPrerequisites.partner.id,
        dueDate: this.actDate,
        notifEmail: this.notificationCheck,
        sourceWorkflowID: this.currentOffer,
        targertWorkflowId: this.selectedOffer.id,
        customerAccountId: this.chosenBillingAccount.id,
      };
      return await changeOffer(this.appliedFilters, this.selectedLinesForActCreation, params);
    },

    doRequest() {},
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
