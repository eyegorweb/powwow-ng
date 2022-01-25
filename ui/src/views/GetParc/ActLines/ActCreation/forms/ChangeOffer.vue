<template>
  <div>
    <ActFormContainer
      v-if="partnerType"
      :validate-fn="doRequest"
      success-message="getparc.actCreation.changeOffer.successMessage"
      warning-message="getparc.actCreation.changeOffer.warning"
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
          has-prerequisite-value="true"
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
          :data-params-needed="isDataParamsError"
          vertical
          @datachange="onServiceChange"
        />
      </div>

      <div slot="messages" class="text-info">
        <div v-if="requestErrors && requestErrors.length">
          <h6 class="text-danger">{{ $t('errors.all') }}</h6>
          <ul class="text-danger list-unstyled">
            <li v-for="error in requestErrors" :key="error.message">{{ error.message }}</li>
          </ul>
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
      if (this.selectedOffer && this.selectedOffer.id) return true;
      return false;
    },
    canChangeDate() {
      if (!this.userIsBO && this.userIsCustomer) {
        return false;
      }
      return true;
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
      servicesChoice: undefined,
      canChangeServices: false,
      isDataParamsError: false,
      partnerType: undefined,
      requestErrors: [],
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
      }
    },
  },

  methods: {
    onServiceChange(servicesChoice) {
      this.servicesChoice = servicesChoice;
      this.offerServices = [...servicesChoice.services, servicesChoice.dataService];
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
        response.errors.forEach((r) => {
          if (r.extensions) {
            if (r.extensions.error && r.extensions.error === 'MassActionLimit') {
              const count = r.extensions && r.extensions.limit ? r.extensions.limit : '';
              const messageErrorMaxLine = this.$t(
                'getparc.actCreation.report.FILE_MAX_LINE_NUMBER_INVALID',
                {
                  count,
                }
              );
              this.requestErrors = [
                {
                  message: messageErrorMaxLine,
                },
              ];
            } else if (
              r.extensions.sourceWorkflowID === 'LONG_LIFE_NOT_ALLOWED' ||
              r.extensions.targetWorkflowID === 'LONG_LIFE_NOT_ALLOWED'
            ) {
              this.requestErrors = [
                {
                  message: this.$t('getparc.actCreation.errors.workflow.LONG_LIFE_NOT_ALLOWED'),
                },
              ];
            } else {
              this.requestErrors = [
                {
                  message: r.message,
                },
              ];
            }
          }
        });
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
