<template>
  <ActFormEmptyContainer
    :validate-fn="validate"
    success-message="getparc.actCreation.changeOffer.successMessage"
    :check-errors-fn="checkErrors"
  >
    <div slot="main" slot-scope="{ containerValidationFn }">
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
import PartnerBillingAccountChoice from './parts/PartnerBillingAccountChoice';

import { mapState, mapGetters } from 'vuex';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import ActFormEmptyContainer from './parts/ActFormEmptyContainer';
import UiDate from '@/components/ui/UiDate2';
import UiCheckbox from '@/components/ui/Checkbox';
import { fetchOffers } from '@/api/offers';
import moment from 'moment';
import Modal from '@/components/Modal';

import { changeOffer } from '@/api/offers';

export default {
  components: {
    PartnerBillingAccountChoice,
    ActFormEmptyContainer,
    UiDate,
    UiCheckbox,
    UiApiAutocomplete,
    Modal,
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
    };
  },

  mounted() {
    // droits sur la date
    switch (this.actCreationPrerequisites.partner.partyType) {
      case 'MVNO':
        this.actDate = moment().format('DD-MM-YYYY');
        this.canChangeDate = false;
        break;
      case 'M2M':
        this.actDate = moment()
          .endOf('month')
          .format('DD-MM-YYYY');
        this.canChangeDate = false;
        break;
      default:
        this.actDate = moment().format('DD-MM-YYYY');
        this.canChangeDate = true;
    }
  },

  methods: {
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
