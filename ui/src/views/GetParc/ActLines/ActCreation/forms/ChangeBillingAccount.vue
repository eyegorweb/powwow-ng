<template>
  <ActFormEmptyContainer
    :validate-fn="validate"
    success-message="getparc.actCreation.transfertCF.successMessage"
  >
    <div slot="main" slot-scope="{ containerValidationFn }">
      <PartnerBillingAccountChoice
        :key="actCreationPrerequisites.partner.id"
        @set:billingAccount="setBillingAccount"
        :errors="errors"
        :initial-parnter="actCreationPrerequisites.partner"
        :limit-to-partners-in-search-bar="limitToPartnersInSearchBar"
      ></PartnerBillingAccountChoice>
      <div class="row">
        <div class="col d-flex">
          <UiCheckbox v-model="notificationCheck" />
          <span>{{ $t('getparc.actCreation.NOTIFICATION_CHECK') }}</span>
        </div>
      </div>
      <div class="row">
        <div v-if="canChangeDate" class="col">
          <UiDate @change="onActDateChange" :value="actDate" fixed class="d-block">
            <i slot="icon" class="select-icon ic-Flag-Icon" />
          </UiDate>
        </div>
        <div class="col">
          <button @click="containerValidationFn" class="btn btn-primary pl-4 pr-4 pt-2 pb-2">
            <span>
              <i class="ic-Shuffle-Icon"></i>
              {{ $t('getparc.actCreation.selectOffer.save') }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </ActFormEmptyContainer>
</template>

<script>
import ActFormEmptyContainer from './parts/ActFormEmptyContainer';
import PartnerBillingAccountChoice from './parts/PartnerBillingAccountChoice';
import { mapState, mapGetters } from 'vuex';
import UiDate from '@/components/ui/UiDate2';
import moment from 'moment';
import UiCheckbox from '@/components/ui/Checkbox';
import { changeCustomerAccount } from '@/api/actCreation';

export default {
  components: {
    ActFormEmptyContainer,
    PartnerBillingAccountChoice,
    UiDate,
    UiCheckbox,
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),

    canChangeDate() {
      if (!this.actCreationPrerequisites || !this.actCreationPrerequisites.partner) return false;
      return this.actCreationPrerequisites.partner.partyType === 'MVNO';
    },
  },
  data() {
    return {
      limitToPartnersInSearchBar: true,
      chosenBillingAccount: undefined,
      errors: {},
      actDate: null,
      notificationCheck: false,
    };
  },
  mounted() {
    this.actDate = moment().format('DD-MM-YYYY');
  },

  methods: {
    setBillingAccount(billingAccount) {
      this.chosenBillingAccount = billingAccount;
    },

    onActDateChange(value) {
      this.actDate = value;
    },

    checkErrors() {},
    async validate() {
      const params = {
        partyId: this.actCreationPrerequisites.partner.id,
        dueDate: this.actDate,

        targetCustomerAccount: this.chosenBillingAccount.id,
        notifEmail: this.notificationCheck,
      };

      return await changeCustomerAccount(
        this.appliedFilters,
        this.selectedLinesForActCreation,
        params
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
