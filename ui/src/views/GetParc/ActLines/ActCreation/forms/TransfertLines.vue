<template>
  <ActFormEmptyContainer
    :validate-fn="validate"
    :check-errors-fn="checkErrors"
    confirm-msg="getparc.actCreation.selectOffer.confirmationWarning"
  >
    <div slot="main" slot-scope="{ containerValidationFn }">
      <div>
        <PartnerBillingAccountChoice
          @set:billingAccount="setBillingAccount"
          :errors="errors"
          :initial-parnter="partner"
          :limit-to-partners-in-search-bar="limitToPartnersInSearchBar"
        >
          <div slot="bottom">
            <div>
              <h6>{{ $t('getparc.actLines.selectOfferTarget') }}</h6>
              <UiApiAutocomplete
                :items="offers"
                v-model="selectedOffer"
                display-results-while-empty
              />
            </div>
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
          </div>
        </PartnerBillingAccountChoice>
      </div>
      <div class="row">
        <div class="col">
          <UiDate
            @change="onActDateChange"
            :value="actDate"
            fixed
            time-picker
            class="d-block"
            :min-date="minDate"
          >
            <i slot="icon" class="select-icon ic-Flag-Icon" />
          </UiDate>
        </div>
        <div class="col">
          <button
            @click="containerValidationFn"
            class="btn btn-primary pl-4 pr-4 pt-2 pb-2"
            :class="{ disabled: !canValidate }"
          >
            <span>
              <i class="ic-Shuffle-Icon"></i>
              {{ $t('getparc.actCreation.selectOffer.save') }}
            </span>
          </button>
        </div>
      </div>
    </div>
    <div slot="messages" class="text-info">
      <div v-if="requestErrors && requestErrors.length">
        <h6 class="text-danger">{{ $t('errors.all') }}</h6>
        <ul class="text-danger list-unstyled">
          <li v-for="error in requestErrors" :key="error.message">{{ error.message }}</li>
        </ul>
      </div>
    </div>
  </ActFormEmptyContainer>
</template>

<script>
import ActFormEmptyContainer from './parts/ActFormEmptyContainer2';
import PartnerBillingAccountChoice from './parts/PartnerBillingAccountChoice';
import UiDate from '@/components/ui/UiDate';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import ServicesBlock from '@/components/Services/ServicesBlock.vue';
import { fetchOffers } from '@/api/offers';
import moment from 'moment';
import { transferSIMCards } from '@/api/actCreation';
import { mapState, mapGetters } from 'vuex';
import { searchLineById } from '@/api/linesActions';
import { getMarketingOfferServices } from '@/components/Services/utils.js';

export default {
  components: {
    ActFormEmptyContainer,
    PartnerBillingAccountChoice,
    UiDate,
    UiApiAutocomplete,
    ServicesBlock,
  },
  data() {
    return {
      actDate: undefined,
      chosenBillingAccount: undefined,
      limitToPartnersInSearchBar: false,
      offers: [],
      selectedOffer: undefined,
      waitForConfirmation: false,
      errors: {},
      singleLineFound: undefined,
      offerEnabled: undefined,
      canChangeServices: false,
      offerServices: undefined,
      isDataParamsError: false,
      servicesChoice: undefined,
      requestErrors: [],
    };
  },
  async mounted() {
    await this.loadSingleLineInfo();
    this.actDate = moment().format('DD/MM/YYYY HH:mm:ss');
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters', 'linesActionsResponse']),
    partner() {
      if (this.actCreationPrerequisites.searchById) {
        if (this.singleLineFound) {
          return this.singleLineFound.party;
        }
      }
      return this.actCreationPrerequisites.partner;
    },
    selectedPartner() {
      if (!this.chosenBillingAccount) return undefined;

      return this.chosenBillingAccount.partner;
    },
    canValidate() {
      return this.selectedPartner ? true : false;
    },
    minDate() {
      return moment().format('DD/MM/YYYY HH:mm:ss');
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
    onActDateChange(value) {
      this.actDate = value;
    },

    setBillingAccount(billingAccount) {
      this.chosenBillingAccount = billingAccount;
      this.refreshOffers();
    },

    async refreshOffers() {
      if (!this.chosenBillingAccount) return;
      this.selectedOffer = undefined;
      this.offers = [];
      let partnerParams = [];
      if (this.chosenBillingAccount && this.chosenBillingAccount.partner) {
        partnerParams.push(this.chosenBillingAccount.partner);
      }
      const data = await fetchOffers('', partnerParams, {
        page: 0,
        limit: 99,
        disabledOffer: true,
        customerAccountCode: this.chosenBillingAccount.code,
      });
      if (data) {
        this.offers = data.map((o) => ({
          id: o.id,
          code: o.code,
          label: o.workflowDescription,
          productCode: o.code,
          data: o,
        }));
      }
    },
    onServiceChange(servicesChoice) {
      this.servicesChoice = servicesChoice;
      this.offerServices = [...servicesChoice.services, servicesChoice.dataService];
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

      return isError;
    },
    async validate(contextValues) {
      const params = {
        partyId: this.partner.id,
        dueDate: this.actDate,
        toPartyId: this.chosenBillingAccount.partner.id,
        toCustomerAccountId: this.chosenBillingAccount.id,
        toWorkflowId: this.selectedOffer ? this.selectedOffer.id : null,
        tempDataUuid: contextValues.tempDataUuid,
        servicesChoice: this.servicesChoice,
      };

      if (this.actCreationPrerequisites && this.actCreationPrerequisites.billingAccount) {
        params.fromCustomerAccountId = this.actCreationPrerequisites.billingAccount.id;
      }

      const response = await transferSIMCards(
        this.appliedFilters,
        this.selectedLinesForActCreation,
        params
      );
      if (response.errors && response.errors.length) {
        response.errors.forEach((r) => {
          if (r.extensions && r.extensions.error) {
            if (r.extensions.error === 'MassActionLimit') {
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
  watch: {
    selectedOffer(selectedOffer) {
      if (selectedOffer && selectedOffer.data) {
        this.offerServices = getMarketingOfferServices(selectedOffer.data.initialOffer);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
