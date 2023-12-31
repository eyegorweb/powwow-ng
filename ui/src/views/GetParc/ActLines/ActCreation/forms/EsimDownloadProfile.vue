<template>
  <ActFormContainer
    :validate-fn="doRequest"
    :check-errors-fn="haveFieldErrors"
    :prevent-send="!canSend"
    disabled-notification-check
  >
    <div v-if="downloadStatuses" class="form-group">
      <label class="small-label">{{ $t('indicators.getparc.lines.esim.downloadStatus') }}</label>
      <UiSelect
        v-if="downloadStatuses"
        class="report-field"
        v-model="selectedDownloadStatus"
        :options="downloadStatuses"
        block
      />
      <div class="text-danger" v-if="fieldErrors && fieldErrors.downloadStatus">
        {{ $t('required') }}
      </div>
    </div>
    <template v-if="canSeeActivationForm">
      <div class="toggles-container">
        <UiToggle label="Préactivation" v-model="preActivation" :editable="false" />
        <UiToggle label="Activation" v-model="activation" :editable="false" />
      </div>

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
          :offer="selectedOffer"
          vertical
          @servicechange="onServiceChange"
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
import UiSelect from '@/components/ui/UiSelect';

import { mapState, mapGetters } from 'vuex';
import { fetchCustomFields } from '@/api/customFields';

import ActFormContainer from './parts/ActFormContainer2';

import ServicesBlock from '@/components/Services/ServicesBlock.vue';

import { getMarketingOfferServices } from '@/components/Services/utils.js';
import { searchLineById } from '@/api/linesActions';
import { esimDownloadProfil } from '@/api/esim.js';
import { formatBackErrors } from '@/utils/errors';

export default {
  components: {
    ActFormContainer,
    UiToggle,
    OffersPart,
    BillingAccountsPart,
    PartnerFields,
    ServicesBlock,
    UiSelect,
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters', 'linesActionsResponse']),
    ...mapGetters(['userName']),

    canSeeActivationForm() {
      if (this.actCreationPrerequisites.searchById) {
        if (this.singleLineFound) {
          return this.singleLineFound.party;
        }
      }
      const status = this.$loGet(this.actCreationPrerequisites, 'selectedStatus.id');
      return status !== 'ACTIVATED';
    },

    partner() {
      if (this.actCreationPrerequisites.searchById) {
        if (this.singleLineFound) {
          return this.singleLineFound.party;
        }
      }
      return this.actCreationPrerequisites.partner;
    },
    preselectBillingAccount() {
      if (this.partner && this.partner.partyType === 'MVNO') {
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
        };
        return formatted;
      }
      return this.actCreationPrerequisites.billingAccount;
    },
    simStatus() {
      if (this.actCreationPrerequisites.searchById) {
        if (this.singleLineFound) {
          const enumSimStatus = [
            {
              id: 'NOT_PREACTIVATED',
              label: this.$t('getparc.actLines.simStatuses.NOT_PREACTIVATED'),
            },
            {
              id: 'PREACTIVATED',
              label: this.$t('getparc.actLines.simStatuses.PREACTIVATED'),
            },
            {
              id: 'ACTIVATED',
              label: this.$t('getparc.actLines.simStatuses.ACTIVATED'),
            },
          ];
          const selectedStatus = enumSimStatus.find(
            (s) => this.$loGet(this.singleLineFound, 'statusTranslated') === s.label
          );
          console.log('here we have selected status', selectedStatus);
          return selectedStatus.id;
        }
      }
      return this.$loGet(this.actCreationPrerequisites, 'selectedStatus.id');
    },
    canSend() {
      // TODO: ajouter le test sur l'offre (UPF)  cf: upfProfileDataNeeded de la préactivation
      if (this.billingAccount && this.billingAccount.id) return true;
      return false;
    },
  },
  data() {
    return {
      limitToPartnersInSearchBar: true,
      activation: true,
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
      exceptionError: undefined,
      selectedDownloadStatus: undefined,
      downloadStatuses: undefined,
    };
  },

  async mounted() {
    this.downloadStatuses = [
      {
        value: 'ENABLED',
        label: this.$t('filters.active'),
      },
      {
        value: 'DISABLED',
        label: this.$t('getreport.report_statut.DISABLED'),
      },
    ];
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
        if (lineInTable) {
          this.singleLineFound = await searchLineById(lineInTable.id);
        }
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

      if (this.canSeeActivationForm) {
        if (!this.preselectBillingAccount || !this.preselectBillingAccount.id) {
          fieldErrors.billingAccount = true;
          haveError = true;
        }
        if (!this.selectedOffer || !this.selectedOffer.data) {
          fieldErrors.offer = true;
          haveError = true;
        }
      }

      if (!this.selectedDownloadStatus) {
        fieldErrors.downloadStatus = true;
        haveError = true;
      }

      this.fieldErrors = fieldErrors;
      return haveError;
    },

    async doRequest(contextValues) {
      let simIds = [];
      if (this.selectedLinesForActCreation && this.selectedLinesForActCreation.length) {
        simIds = this.selectedLinesForActCreation.map((s) => s.id);
      }
      const response = await esimDownloadProfil({
        filters: this.appliedFilters,
        simCardInstanceIds: simIds,
        customerAccountID: this.billingAccount
          ? this.$loGet(this.billingAccount, 'id', null)
          : this.$loGet(this.preselectBillingAccount, 'id', null),
        workflowCode: this.selectedOffer ? this.selectedOffer.id : null,
        tempDataUuid: contextValues.tempDataUuid,
        partyId: this.$loGet(this.partner, 'id', null),
        dueDate: contextValues.actDate,
        targetDownload: this.selectedDownloadStatus,
        services: this.servicesChoice,
        simStatus: this.simStatus,
        allCustomFields: this.customFieldsValues,
      });
      if (response && response.errors && response.errors.length) {
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
          } else if (
            e.value === 'MANDATORY_SERVICE_NOT_FOUND' ||
            e.value === 'INCOMPATIBLE_SERVICE' ||
            e.value === 'MANDATORY_SERVICE'
          ) {
            let service = e.key;
            errorMessage = `${this.$t('getparc.actCreation.report.' + e.value, {
              service,
            })}`;
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

    async loadCustomFields() {
      if (this.partner) {
        this.allCustomFields = await fetchCustomFields(this.partner.id);
      }
      this.decideOnMandatoryCustomFields();
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
