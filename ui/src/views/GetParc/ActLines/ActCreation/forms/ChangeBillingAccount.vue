<template>
  <ActFormContainer
    :validate-fn="validate"
    success-message="getparc.actCreation.transfertCF.successMessage"
    :prevent-send="!canSend"
    :can-change-date="canChangeDate"
  >
    <div>
      <BillingAccountChoice
        :key="actCreationPrerequisites.partner.id"
        :partner-id="actCreationPrerequisites.partner.id"
        @set:billingAccount="setBillingAccount"
        :errors="errors"
      />
    </div>
    <div slot="validate-btn-content" slot-scope="{ containerValidationFn }">
      <button
        @click="containerValidationFn"
        :disabled="!canSend"
        class="btn btn-primary pl-4 pr-4 pt-2 pb-2"
      >
        <span>
          <i class="ic-Wallet-Icon"></i>
          {{ $t('getparc.actCreation.changeBillingAccount') }}
        </span>
      </button>
    </div>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import BillingAccountChoice from './parts/BillingAccountChoice';
import { mapState, mapGetters } from 'vuex';
import moment from 'moment';
import { changeCustomerAccount } from '@/api/actCreation';

export default {
  components: {
    ActFormContainer,
    BillingAccountChoice,
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
    ...mapGetters(['userInfos', 'userIsBO', 'userIsPartner']),

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
    canSend() {
      if (this.chosenBillingAccount && this.chosenBillingAccount.id) return true;
      return false;
    },
    isPartnerMVNO() {
      if (!this.userInfos || !this.userInfos.roles) return;
      const found = this.userInfos.roles.find(r => {
        return r.description === 'MVNO';
      });
      return !!found;
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

  methods: {
    setBillingAccount(billingAccount) {
      this.chosenBillingAccount = billingAccount;
    },

    onActDateChange(value) {
      this.actDate = value;
    },

    checkErrors() {},
    async validate(contextValues) {
      const params = {
        partyId: this.actCreationPrerequisites.partner.id,
        dueDate: contextValues.actDate,
        targetCustomerAccount: this.chosenBillingAccount.id,
        notifEmail: this.notificationCheck,
        tempDataUuid: contextValues.tempDataUuid,
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
