<template>
  <div>
    <ActFormContainer
      v-if="partnerType"
      :validate-fn="doRequest"
      success-message="getparc.actCreation.changeOffer.successMessage"
      :warning-message="warningMessage"
      :check-errors-fn="checkErrors"
      :prevent-send="!canSend"
      :can-change-date="canChangeDate"
      :partner-type="partnerType"
    >
      <template>
        <h6>{{ $t('getparc.actLines.selectOffer') }}</h6>
        <OffersPart
          :partner="actCreationPrerequisites.partner"
          :offer.sync="selectedOffer"
          :error="errors.offer"
          :chosen-billing-account="actCreationPrerequisites.billingAccount"
          billing-account-mandatory
          has-prerequisite-value
        />
      </template>

      <div v-if="selectedOffer && selectedOffer.data" class="row">
        <div class="col-md-8 mb-3" v-if="offerEnabled">
          <UiToggle
            :label="$t('getparc.actCreation.changeOffer.changeServices')"
            v-model="canChangeServices"
            :on-text="$t('yes')"
            :off-text="$t('no')"
          />
        </div>
      </div>

      <hr />

      <div v-if="canChangeServices || !offerEnabled">
        <ServicesBlock
          v-if="selectedOffer"
          :key="selectedOffer.label"
          :services="offerServices"
          :initial-services="initialServices"
          :offer="selectedOffer"
          :data-params-needed="isDataParamsError"
          vertical
          @servicechange="onServiceChange"
          @updateProfileData="onUpdateProfileData"
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
    </ActFormContainer>
  </div>
</template>

<script>
import UiToggle from '@/components/ui/UiToggle';
import OffersPart from '@/views/GetParc/ActLines/ActCreation/prerequisites/parts/OffersPart';

import { mapState, mapGetters } from 'vuex';
import ActFormContainer from './parts/ActFormContainer2';
import ServicesBlock from '@/components/Services/ServicesBlock.vue';

import { changeOffer } from '@/api/actCreation';

import { getOfferOption } from '@/api/partners.js';
import { getMarketingOfferServices } from '@/components/Services/utils.js';
import { formatBackErrors } from '@/utils/errors';
import cloneDeep from 'lodash.clonedeep';

export default {
  components: {
    UiToggle,
    ActFormContainer,
    ServicesBlock,
    OffersPart,
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
    ...mapGetters(['userIsCustomer', 'userIsBO']),
    currentOffer() {
      return this.actCreationPrerequisites.offer.data.id;
    },
    canSend() {
      if (this.selectedOffer && this.selectedOffer.id && !this.upfProfileDataNeeded) return true;
      return false;
    },
    canChangeDate() {
      if (!this.userIsBO && this.userIsCustomer) {
        return false;
      }
      return true;
    },
    changedServices() {
      if (!this.offerServices) return [];
      return this.offerServices.filter((s) => {
        const initialService = this.initialServices.find((os) => os.code === s.code);
        return initialService.checked !== s.checked;
      });
    },
    // Services activés à l'initialisation
    // listActivatedServices() {
    //   if (!this.offerServices) return [];
    //   const initialActivatedServices = this.offerServices
    //     .filter((s) => s.checked)
    //     .map((s) => s.code);
    //   const unClickedServicesForActivation = this.changedServices.filter((cs) => !cs.isClicked);
    //   return differencewith(
    //     initialActivatedServices,
    //     unClickedServicesForActivation,
    //     (a, b) => a === b.code
    //   );
    // },
    // Services activés automatiquement
    listAutoServiceMandatory() {
      if (!this.changedServices) return [];
      return this.changedServices
        .filter((s) => s.checked && !s.isClicked)
        .map((s) => s.labelService);
    },
    // Services désactivés automatiquement
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
      selectedOffer: undefined,
      actDate: null,
      offerEnabled: undefined,
      errors: {},
      notificationCheck: false,
      waitForConfirmation: false,
      limitToPartnersInSearchBar: true,
      offerServices: undefined,
      initialServices: undefined,
      servicesChoice: undefined,
      canChangeServices: false,
      isDataParamsError: false,
      partnerType: undefined,
      exceptionError: undefined,
      upfProfileDataNeeded: false,
    };
  },

  async mounted() {
    if (this.actCreationPrerequisites.partner.partyType) {
      this.offerEnabled = await getOfferOption(this.actCreationPrerequisites.partner.id);
      this.partnerType = this.actCreationPrerequisites.partner.partyType;
    }
  },

  watch: {
    selectedOffer(selectedOffer) {
      if (selectedOffer && selectedOffer.data) {
        this.offerServices = getMarketingOfferServices(selectedOffer.data.initialOffer);
        this.initialServices = cloneDeep(this.offerServices);
        this.upfProfileDataNeeded = false; // default value
      }
    },
  },

  methods: {
    onServiceChange(servicesChoice) {
      this.servicesChoice = servicesChoice;
      if (servicesChoice.dataService) {
        this.offerServices = [...servicesChoice.services, servicesChoice.dataService];
      } else if (servicesChoice.upfService) {
        this.offerServices = [...servicesChoice.services, servicesChoice.upfService];
      } else {
        this.offerServices = [...servicesChoice.services];
      }
    },
    onUpdateProfileData(payload) {
      if (payload) {
        this.upfProfileDataNeeded = false;
      } else {
        this.upfProfileDataNeeded = true;
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

      if (!this.selectedOffer) {
        this.errors.offer = 'errors.mandatory';
        isError = true;
      }

      if (this.$loGet(this.servicesChoice, 'dataService.checked')) {
        this.isDataParamsError =
          this.servicesChoice.dataService &&
          this.servicesChoice.dataService.parameters &&
          this.servicesChoice.dataService.parameters.filter((p) => p.selected).length === 0;
        isError = this.isDataParamsError;
      }

      return isError;
    },

    async doRequest(contextValues) {
      if (!this.offerEnabled) {
        this.canChangeServices = true;
      }
      const params = {
        notifEmail: contextValues.notificationCheck,
        dueDate: contextValues.actDate,
        partyId: this.actCreationPrerequisites.partner.id,
        tempDataUuid: contextValues.tempDataUuid,
        servicesChoice: this.servicesChoice,
        customerAccountID: this.actCreationPrerequisites.billingAccount.id,
        sourceWorkflowID: this.actCreationPrerequisites.offer.data.id,
        targetWorkflowID: this.selectedOffer.data.id,
      };
      const response = await changeOffer(
        this.appliedFilters,
        this.selectedLinesForActCreation,
        params,
        !this.canChangeServices
      );
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
          } else if (
            e.value === 'MANDATORY_SERVICE_NOT_FOUND' ||
            e.value === 'INCOMPATIBLE_SERVICE' ||
            e.value === 'MANDATORY_SERVICE'
          ) {
            let service = e.key;
            errorMessage = `${this.$t('getparc.actCreation.report.' + e.value, {
              service,
            })}`;
          } else if (e.key === 'API_ERROR') {
            errorMessage = `${this.$t('getparc.actCreation.report.' + e.key)}`;
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

  ::v-deep .datepicker {
    background-color: $medium-gray;
  }
}
</style>
