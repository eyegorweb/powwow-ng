<template>
  <ActFormContainer
    :validate-fn="doRequest"
    :check-errors-fn="haveFieldErrors"
    :prevent-send="!canSend"
    :warning-message="warningMessage"
  >
    <template v-if="partner">
      <div class="toggles-container">
        <UiToggle label="Préactivation" v-model="preActivation" :editable="false" />
        <UiToggle label="Activation" v-model="activation" />
      </div>

      <div v-if="isUserReferenceEnabled">
        <label class="font-weight-bold"
          >{{ $t('orders.detail.referenceClient') }}
          <div class="text-danger" v-if="fieldErrors && fieldErrors.userReference">
            {{ $t('required') }}
          </div></label
        >
        <UiInput class="d-block mx-auto" v-model="userReferenceValue" />
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
            :preselect-billing-account="preselectBillingAccount"
            :disabled="!!preselectBillingAccount && partner.partyType !== 'MVNO'"
            @set:billingAccount="setBillingAccount"
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
            :services="offerServices"
            :initial-services="initialServices"
            vertical
            @datachange="onServiceChange"
            :data-params-needed="isDataParamsError"
            :offer="selectedOffer"
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

      <div slot="messages" class="text-info">
        <div v-if="exceptionError">
          <h6 class="text-danger">{{ $t('errors.all') }}</h6>
          <div class="text-danger">
            {{ exceptionError }}
          </div>
        </div>
      </div>
    </template>
  </ActFormContainer>
</template>

<script>
import UiToggle from '@/components/ui/UiToggle';
import OffersPart from '@/views/GetParc/ActLines/ActCreation/prerequisites/parts/OffersPart';
import BillingAccountsPart from '@/views/GetParc/ActLines/ActCreation/prerequisites/parts/BillingAccountsPart';
import PartnerFields from '@/components/PartnerFields';
import UiInput from '@/components/ui/UiInput';

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
import { getPartyOptions } from '@/api/partners';
import { formatBackErrors } from '@/utils/errors';

import cloneDeep from 'lodash.clonedeep';

export default {
  components: {
    ActFormContainer,
    UiToggle,
    OffersPart,
    BillingAccountsPart,
    PartnerFields,
    ServicesBlock,
    UiInput,
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
      let data;
      if (this.actCreationPrerequisites.searchById) {
        if (this.singleLineFound && this.singleLineFound.customerAccountForActivation) {
          data = this.singleLineFound.customerAccountForActivation;
        } else if (
          this.singleLineFound &&
          this.singleLineFound.accessPoint &&
          this.singleLineFound.accessPoint.offerGroup &&
          this.singleLineFound.accessPoint.offerGroup.customerAccount
        ) {
          data = this.singleLineFound.accessPoint.offerGroup.customerAccount;
        }

        if (!data) {
          return null;
        }

        const formatted = {
          id: data.id,
          label: `${data.code} - ${data.name}`,
          code: data.code,
          data,
          // partner: data.party,
          // partnerId: data.party.id,
        };
        return formatted;
      }
      return this.actCreationPrerequisites.billingAccount;
    },
    canSend() {
      if (this.billingAccount && this.billingAccount.id) return true;
      return false;
    },
    isUserReferenceEnabled() {
      if (!this.actCreationPrerequisites) return false;
      let userReference = false;

      if (this.partnerOptions) {
        userReference = this.partnerOptions.userReferenceEnabled;
      }

      return userReference;
    },
    changedServices() {
      if (!this.offerServices) return [];
      return this.offerServices.filter((s) => {
        const initialService = this.initialServices.find((os) => os.code === s.code);
        return initialService.checked !== s.checked && initialService.isClicked !== !s.isClicked;
      });
    },
    // Services activés à l'initialisation
    listActivatedServices() {
      if (!this.offerServices) return [];
      return this.offerServices
        .filter(
          (s) =>
            s.checked &&
            !this.changedServices.find((cs) => {
              return s.code === cs.code;
            })
        )
        .map((s) => s.code);
    },
    // Services activés automatiquement
    listAutoServiceMandatory() {
      if (!this.changedServices) return [];
      return this.changedServices
        .filter((s) => s.checked && this.listActivatedServices.find((serv) => serv !== s.code))
        .map((s) => s.code);
    },
    // Services désactivés automatiquement
    listAutoServiceIncompatible() {
      if (!this.changedServices) return [];
      return this.changedServices
        .filter((s) => !s.checked && s.listServiceIncompatible)
        .map((s) => s.code);
    },
    warningMessage() {
      let list = '',
        newLine1 = '',
        newLine2 = '';
      let message = '';
      if (this.listActivatedServices.length > 0) {
        list += `${this.$t('services.listServiceMandatory')}: ${this.listActivatedServices
          .map((s) => s)
          .join(',')}`;
      }
      if (this.listAutoServiceMandatory.length > 0) {
        if (this.listActivatedServices.length) {
          newLine1 = '<br />';
        }
        list += `${newLine1}${this.$t(
          'services.listAutoServiceMandatory'
        )}: ${this.listAutoServiceMandatory.map((s) => s).join(',')}`;
      }
      if (this.listAutoServiceIncompatible.length > 0) {
        if (this.listAutoServiceIncompatible.length) {
          newLine2 = '<br />';
        }
        list += `${newLine2}${this.$t(
          'services.listAutoServiceIncompatible'
        )}: ${this.listAutoServiceIncompatible.map((s) => s).join(',')}`;
      }
      if (!list) {
        message = `${this.$t('getparc.actCreation.preactivateActivate.confirmAction')}`;
      } else {
        message = `${this.$t('getparc.actCreation.preactivateActivate.confirmationWarning', {
          list,
        })}`;
      }
      return message;
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
      initialServices: undefined,
      servicesChoice: undefined,
      chosenBillingAccount: undefined,
      singleLineFound: undefined,
      exceptionError: undefined,
      partnerOptions: undefined,
      userReferenceValue: undefined,
      isDataParamsError: false,
      dataService: undefined,
    };
  },

  async mounted() {
    await this.loadSingleLineInfo();
    this.loadCustomFields();
    this.refreshOptions();
  },

  watch: {
    selectedOffer(selectedOffer) {
      if (selectedOffer && selectedOffer.data) {
        this.offerServices = getMarketingOfferServices(selectedOffer.data.initialOffer);
        this.initialServices = cloneDeep(this.offerServices);
      }
      this.setup();
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
      this.setup();
    },

    setup() {
      if (!this.offerServices) return;
      const dataService = this.offerServices.find((s) => s.code === 'DATA');
      if (dataService) {
        this.dataService = { ...dataService };
      }
    },

    haveFieldErrors() {
      const fieldErrors = {};
      let haveError = false;
      this.isDataParamsError = false;
      if (this.activation) {
        let billingAccountToUse = this.preselectBillingAccount;
        if (!this.preselectBillingAccount) {
          billingAccountToUse = this.chosenBillingAccount;
        }

        if (!billingAccountToUse || !billingAccountToUse.id) {
          fieldErrors.billingAccount = true;
          haveError = true;
        }
        if (!this.selectedOffer || !this.selectedOffer.data) {
          fieldErrors.offer = true;
          haveError = true;
        }
        if (this.$loGet(this.servicesChoice, 'dataService.checked')) {
          this.isDataParamsError =
            this.servicesChoice.dataService &&
            this.servicesChoice.dataService.parameters &&
            this.servicesChoice.dataService.parameters.filter((p) => p.selected).length === 0;
          haveError = this.isDataParamsError;
        }
      }

      if (this.isUserReferenceEnabled && !this.userReferenceValue) {
        fieldErrors.userReference = true;
        haveError = true;
      }

      this.fieldErrors = fieldErrors;
      return haveError;
    },

    async doRequest(contextValues) {
      let params, response;
      if (this.activation) {
        let billingAccountToUse = this.preselectBillingAccount;
        if (!this.preselectBillingAccount) {
          billingAccountToUse = this.chosenBillingAccount;
        }

        params = {
          partyId: this.partner.id,
          dueDate: contextValues.actDate,
          notifEmail: contextValues.notificationCheck,
          workflowCode: this.selectedOffer ? this.selectedOffer.id : undefined,
          servicesChoice: this.servicesChoice,
          customerAccountID: billingAccountToUse.id,
          tempDataUuid: contextValues.tempDataUuid,
          allCustomFields: this.customFieldsValues,
          userRef: this.userReferenceValue,
        };

        response = await preactivateAndActivateSImcardInstance(
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
          userRef: this.userReferenceValue,
        };

        response = await preactivateSimCardInstance(
          this.appliedFilters,
          this.selectedLinesForActCreation,
          params
        );
      }
      if (response.errors && response.errors.length) {
        let errorMessage = '',
          massActionLimitError = '',
          count;
        const formatted = formatBackErrors(response.errors)
          .map((e) => e.errors)
          .flat();
        formatted.forEach((e) => {
          if (e.key === 'limit') {
            count = e.value;
          }
          if (e.key === 'error') {
            massActionLimitError = `${e.key}.${e.value}`;
          } else {
            errorMessage = `${e.key}: ${e.value}`;
          }
        });
        if (massActionLimitError) {
          this.exceptionError = `${this.$t(
            'getparc.actCreation.report.errors.' + massActionLimitError,
            {
              count,
            }
          )}`;
        } else {
          this.exceptionError = errorMessage;
        }

        return {
          errors: response.errors,
          validationError: {
            validated: response.validated,
            tempDataUuid: response.tempDataUuid,
          },
        };
      }
      return response;
    },

    async confirmValdation(containerValidationFn) {
      this.isLoading = true;
      const response = await containerValidationFn();
      this.isLoading = false;
      this.waitForReportConfirmation = false;
      return response;
    },
    async refreshOptions() {
      if (this.partner) {
        this.partnerOptions = await getPartyOptions(this.partner.id);
      } else {
        this.partnerOptions = undefined;
      }
    },

    async loadCustomFields() {
      if (this.partner) {
        this.allCustomFields = await fetchCustomFields(this.partner.id);
        this.decideOnMandatoryCustomFields();
      }
    },

    decideOnMandatoryCustomFields() {
      if (this.allCustomFields && this.allCustomFields.customFields) {
        this.allCustomFields = this.allCustomFields.customFields.map((c) => {
          c.isOptional = true;
          if (this.activation && c.mandatory === 'ACTIVATION') {
            c.isOptional = false;
          }
          return c;
        });
      }
    },

    getSelectedValue(code) {
      const existingFieldValue = this.customFieldsValues.find((c) => c.code === code);
      if (existingFieldValue) {
        return existingFieldValue.enteredValue;
      }
    },

    onValueChanged(customField, enteredValue) {
      const existingFieldValue = this.customFieldsValues.find((c) => c.code === customField.code);
      if (existingFieldValue) {
        this.customFieldsValues = this.customFieldsValues.map((c) => {
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
