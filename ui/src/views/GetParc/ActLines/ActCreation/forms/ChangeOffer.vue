<template>
  <div>
    <ActFormContainer
      v-if="partnerType"
      :validate-fn="doRequest"
      success-message="getparc.actCreation.changeOffer.successMessage"
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
        />
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
      </div>

      <hr />

      <div v-if="canChangeServices">
        <ServicesBlock
          v-if="selectedOffer"
          :key="selectedOffer.label"
          :services="offerServices"
          :data-params-needed="isDataParamsError"
          vertical
          @change="onServiceChange"
        />
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
    ...mapGetters(['userInfos', 'userIsBO', 'userIsPartner']),
    currentOffer() {
      return this.actCreationPrerequisites.offer.data.id;
    },
    canSend() {
      if (this.selectedOffer && this.selectedOffer.id) return true;
      return false;
    },
    canChangeDate() {
      if (this.userIsBo) {
        if (!this.actCreationPrerequisites || !this.actCreationPrerequisites.partner) return false;
        return this.actCreationPrerequisites.partner.partyType === 'MVNO';
      } else if (this.userIsPartner) {
        return this.isPartnerMVNO;
      } else {
        return true;
      }
    },
    isPartnerMVNO() {
      if (!this.userInfos || !this.userInfos.roles) return;
      const found = this.userInfos.roles.find((r) => {
        return r.description === 'MVNO';
      });
      return !!found;
    },
  },
  data() {
    return {
      selectedOffer: undefined,
      actDate: null,
      errors: {},
      notificationCheck: false,
      waitForConfirmation: false,
      limitToPartnersInSearchBar: true,

      offerServices: undefined,
      servicesChoice: undefined,
      canChangeServices: false,
      isDataParamsError: false,
      partnerType: undefined,
    };
  },

  mounted() {
    if (this.actCreationPrerequisites.partner.partyType) {
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

      if (this.servicesChoice && this.servicesChoice.dataService) {
        this.isDataParamsError =
          this.servicesChoice.dataService &&
          this.servicesChoice.dataService.parameters &&
          this.servicesChoice.dataService.parameters.filter((p) => p.selected).length === 0;
        isError = this.isDataParamsError;
      }

      return isError;
    },

    async doRequest(contextValues) {
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
      return await changeOffer(
        this.appliedFilters,
        this.selectedLinesForActCreation,
        params,
        !this.canChangeServices
      );
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
  /deep/ .datepicker {
    background-color: $medium-gray;
  }
}
</style>
