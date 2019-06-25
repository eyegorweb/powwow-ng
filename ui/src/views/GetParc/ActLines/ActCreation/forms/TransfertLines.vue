<template>
  <ActFormEmptyContainer :validate-fn="validate" :check-errors-fn="checkErrors">
    <div slot="main" slot-scope="{ containerValidationFn }">
      <div>
        <PartnerBillingAccountChoice @set:billingAccount="setBillingAccount" :errors="errors">
          <div slot="bottom">
            <div>
              <h6>{{ $t('getparc.actLines.selectOffer') }}</h6>
              <UiApiAutocomplete
                :items="offers"
                v-model="selectedOffer"
                :error="errors.offer"
                display-results-while-empty
              />
            </div>
          </div>
        </PartnerBillingAccountChoice>
      </div>
      <div class="row">
        <div class="col">
          <UiDate @change="onActDateChange" :value="actDate" fixed class="d-block">
            <i slot="icon" class="select-icon ic-Flag-Icon" />
          </UiDate>
        </div>
        <div class="col">
          <button @click="waitForConfirmation = true" class="btn btn-primary pl-4 pr-4 pt-2 pb-2">
            <span>
              <i class="ic-Shuffle-Icon"></i>
              {{ $t('getparc.actCreation.selectOffer.save') }}
            </span>
          </button>
        </div>
      </div>

      <Modal v-if="waitForConfirmation">
        <div slot="body">
          <div class="text-danger">
            <i class="ic-Alert-Icon"></i>
            {{ $t('getparc.actCreation.selectOffer.confirmationWarning') }}
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
import ActFormEmptyContainer from './parts/ActFormEmptyContainer';
import PartnerBillingAccountChoice from './parts/PartnerBillingAccountChoice';
import UiDate from '@/components/ui/UiDate2';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { fetchOffers } from '@/api/offers';
import moment from 'moment';
import Modal from '@/components/Modal';
import { transferSIMCards } from '@/api/actCreation';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    ActFormEmptyContainer,
    PartnerBillingAccountChoice,
    UiDate,
    UiApiAutocomplete,
    Modal,
  },
  data() {
    return {
      actDate: undefined,
      chosenBillingAccount: undefined,

      offers: [],
      selectedOffer: undefined,
      waitForConfirmation: false,
      errors: {},
    };
  },
  mounted() {
    this.actDate = moment().format('DD-MM-YYYY hh:mm:ss');
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
    selectedPartner() {
      if (!this.chosenBillingAccount) return undefined;

      return this.chosenBillingAccount.partner;
    },
  },
  methods: {
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

        toPartyId: this.chosenBillingAccount.partner.id,
        toCustomerAccountId: this.chosenBillingAccount.id,
        toWorkflowId: this.selectedOffer.id,
      };
      return await transferSIMCards(this.appliedFilters, this.selectedLinesForActCreation, params);
    },
  },
};
</script>

<style lang="scss" scoped></style>
