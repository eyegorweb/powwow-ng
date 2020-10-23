<template>
  <ActFormContainer
    :validate-fn="validate"
    success-message="getparc.actCreation.transfertCF.successMessage"
    :prevent-send="!canSend"
    :can-change-date="canChangeDate"
  >
    <template v-if="partner">
      <div>
        <BillingAccountChoice
          :key="partner.id"
          :partner-id="'' + partner.id"
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
    </template>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import BillingAccountChoice from './parts/BillingAccountChoice';
import { mapState, mapGetters } from 'vuex';
import { changeCustomerAccount } from '@/api/actCreation';
import { searchLineById } from '@/api/linesActions';

export default {
  components: {
    ActFormContainer,
    BillingAccountChoice,
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters', 'linesActionsResponse']),
    ...mapGetters(['userInfos', 'userIsBO', 'userIsPartner']),

    partner() {
      if (this.actCreationPrerequisites.searchById) {
        if (this.singleLineFound) {
          return this.singleLineFound.party;
        }
      }
      return this.actCreationPrerequisites.partner;
    },

    canChangeDate() {
      if (this.userIsBo) {
        if (!this.actCreationPrerequisites || !this.partner) return false;
        return this.partner.partyType === 'MVNO';
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
  async mounted() {
    await this.loadSingleLineInfo();
  },
  data() {
    return {
      limitToPartnersInSearchBar: true,
      chosenBillingAccount: undefined,
      errors: {},
      actDate: null,
      notificationCheck: false,
      singleLineFound: undefined,
    };
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
    setBillingAccount(billingAccount) {
      this.chosenBillingAccount = billingAccount;
    },

    onActDateChange(value) {
      this.actDate = value;
    },

    checkErrors() {},
    async validate(contextValues) {
      const params = {
        partyId: this.partner.id,
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
