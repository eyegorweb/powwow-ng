<template>
  <ActFormContainer :validate-fn="doRequest">
    <div v-if="selectedOffer" class="row">
      <div class="col">
        <span class="font-weight-bold mt-4 mb-4">
          {{ $t('getparc.actCreation.changeService.servicesToEnable') }}
        </span>
        <ServicesChoice
          :offer="selectedOffer"
          :selected-items.sync="servicesToActivate"
          :ignored-items="servicesToDesactivate"
        />
      </div>
      <div class="col">
        <span class="font-weight-bold mt-4 mb-4">
          {{ $t('getparc.actCreation.changeService.servicesToDisable') }}
        </span>
        <ServicesChoice
          :offer="selectedOffer"
          :selected-items.sync="servicesToDesactivate"
          :ignored-items="servicesToActivate"
        />
      </div>
    </div>
    <div v-if="noServicesChosenError" class="row mt-1 mb-1">
      <div class="col text-danger">
        {{ $t('getparc.actCreation.changeService.servicesMandatory') }}
      </div>
    </div>
    <div slot="messages">
      <div v-if="requestErrors">
        <h6 class="text-danger">{{ $t('errors.all') }}</h6>
        <ul class="text-danger list-unstyled">
          <li :key="error.message" v-for="error in requestErrors">{{ error.message }}</li>
        </ul>
      </div>

      <FormReport v-if="report" :data="report" />
    </div>
    <div
      slot="validate-btn-content"
      slot-scope="{ containerValidationFn, actDate, notificationCheck }"
    >
      <button
        v-if="!tempDataUuid"
        @click="waitForReportConfirmation = true"
        class="btn btn-primary pl-4 pr-4 pt-2 pb-2"
      >
        <i class="ic-Edit-Icon" />
        {{ $t('getparc.actCreation.changeService.validateBtn') }}
      </button>
      <button
        v-else
        @click="waitForReportConfirmation = true"
        class="btn btn-success pl-4 pr-4 pt-2 pb-2"
      >
        <i class="ic-Check-Icon" />
        {{ $t('getparc.actCreation.changeService.confirmBtn') }}
      </button>

      <Modal v-if="waitForReportConfirmation">
        <div slot="body">
          <div class="text-danger">
            <i class="ic-Alert-Icon"></i>
            {{ $t('getparc.actCreation.changeService.confirmationWarning') }}
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
            {{ $t('processing') }} <CircleLoader />
          </button>
        </div>
      </Modal>
    </div>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer';
import FormReport from './parts/FormReport';
// import SelectOffer from './parts/SelectOffer';
import { mapState, mapGetters } from 'vuex';
import ServicesChoice from './parts/ServicesChoice';
import Modal from '@/components/Modal';
import { addServices } from '@/api/actCreation';
import CircleLoader from '@/components/ui/CircleLoader';

export default {
  components: {
    ActFormContainer,
    ServicesChoice,
    Modal,
    CircleLoader,
    FormReport,
  },

  data() {
    return {
      servicesToActivate: [],
      servicesToDesactivate: [],
      requestErrors: undefined,
      waitForReportConfirmation: false,
      isLoading: false,
      tempDataUuid: undefined,
      report: undefined,
      noServicesChosenError: undefined,
    };
  },

  methods: {
    setServicesToActivate(values) {
      this.servicesToActivate = values;
    },
    setServicesToDesactivate(values) {
      this.servicesToDesactivate = values;
    },

    async doRequest(contextValues) {
      this.requestErrors = undefined;

      if (!this.tempDataUuid) {
        const response = await this.changeServices(contextValues);
        if (!response.errors) {
          this.tempDataUuid = response.data.changeServices.tempDataUuid;
        } else {
          this.requestErrors = response.errors;
          return { stayInForm: true };
        }

        this.report = response.data.changeServices;
        if (this.report.containsErrors) {
          return { stayInForm: true };
        } else {
          return response;
        }
      } else {
        return await this.changeServices(contextValues);
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

    checkErrors() {
      this.noServicesChosenError = undefined;

      const noServicesChosen =
        !this.servicesToActivate.length && !this.servicesToDesactivate.length;

      this.noServicesChosenError = noServicesChosen;

      return noServicesChosen;
    },

    async changeServices(contextValues) {
      const params = {
        partyId: this.actCreationPrerequisites.partner.id,
        dueDate: contextValues.actDate,
        notifEmail: contextValues.notificationCheck,
        offer: this.selectedOffer.data.initialOffer.code,
        servicesToActivate: this.servicesToActivate.map(s => s.code),
        servicesToDesactivate: this.servicesToDesactivate.map(s => s.code),
        tempDataUuid: this.tempDataUuid,
      };

      return await addServices(this.appliedFilters, this.selectedLinesForActCreation, params);
    },
  },

  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
    partner() {
      if (!this.actCreationPrerequisites) return;
      return this.actCreationPrerequisites.partner;
    },
    selectedOffer() {
      if (!this.actCreationPrerequisites) return;
      return this.actCreationPrerequisites.offer;
    },
  },

  watch: {
    actCreationPrerequisites() {
      this.tempDataUuid = undefined;
    },
    appliedFilters() {
      this.tempDataUuid = undefined;
      this.selectedOffer = undefined;
    },
    selectedLinesForActCreation() {
      this.tempDataUuid = undefined;
    },
  },
};
</script>

<style lang="scss" scoped></style>
