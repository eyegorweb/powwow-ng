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
      >
      </PartnerBillingAccountChoice>
    </div>
    <div v-if="selectedOffer && selectedOffer.data">
      <SimServices :offer="selectedOffer.data" />
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
  </ActFormContainer>
</template>

<script>
import UiToggle from '@/components/ui/UiToggle';
import OffersPart from '@/views/GetParc/ActLines/ActCreation/prerequisites/parts/OffersPart';
import CustomFields from '@/components/CustomFields';

import { mapState, mapGetters } from 'vuex';
import { fetchCustomFields } from '@/api/customFields';

import ActFormContainer from './parts/ActFormContainer';

import SimServices from './parts/SimServices';
import PartnerBillingAccountChoice from './parts/PartnerBillingAccountChoice';

export default {
  components: {
    ActFormContainer,
    UiToggle,
    OffersPart,
    SimServices,
    CustomFields,
    PartnerBillingAccountChoice,
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
    partner() {
      return this.actCreationPrerequisites.partner;
    },
  },
  data() {
    return {
      activation: false,
      preActivation: true,
      selectedOffer: undefined,
      customFieldsErrors: undefined,
      allCustomFields: [],
      customFieldsValues: [],
      chosenBillingAccount: undefined,
      errors: {},
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
    doRequest() {},

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
