<template>
  <ActFormContainer
    v-if="partnerType"
    :validate-fn="validate"
    success-message="getparc.actCreation.transfertCF.successMessage"
    :prevent-send="!canSend"
    :can-change-date="canChangeDate"
    :partner-type="partnerType"
  >
    <template v-if="partner">
      <div>
        <BillingAccountChoice
          :key="partner.id"
          :partner="partner"
          @set:billingAccount="setBillingAccount"
          :errors="errors"
          :previous-billing-account="billingAccountFromSingleLine"
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
      <div slot="messages" class="text-info">
        <div v-if="exceptionError">
          <h6 class="text-danger">{{ $t('errors.all') }}</h6>
          <div class="text-danger">
            {{ exceptionError }}
          </div>
        </div>
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
import { formatBackErrors } from '@/utils/errors';

export default {
  components: {
    ActFormContainer,
    BillingAccountChoice,
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters', 'linesActionsResponse']),
    ...mapGetters(['userIsCustomer', 'userIsBO']),

    partner() {
      if (this.actCreationPrerequisites.searchById) {
        if (this.singleLineFound) {
          return this.singleLineFound.party;
        }
      }
      return this.actCreationPrerequisites.partner;
    },
    billingAccountFromSingleLine() {
      if (this.actCreationPrerequisites.searchById && this.singleLineFound) {
        if (this.singleLineFound.accessPoint && this.singleLineFound.accessPoint.offerGroup) {
          return this.singleLineFound.accessPoint.offerGroup.customerAccount;
        }
      }
      return undefined;
    },
    canChangeDate() {
      if (!this.userIsBO && this.userIsCustomer) {
        return false;
      }
      return true;
    },

    canSend() {
      if (this.chosenBillingAccount && this.chosenBillingAccount.id) return true;
      return false;
    },
  },
  async mounted() {
    await this.loadSingleLineInfo();
    this.partnerType = this.partner.partyType;
  },
  data() {
    return {
      limitToPartnersInSearchBar: true,
      chosenBillingAccount: undefined,
      errors: {},
      actDate: null,
      notificationCheck: false,
      singleLineFound: undefined,
      exceptionError: undefined,
      partnerType: undefined,
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

      const response = await changeCustomerAccount(
        this.appliedFilters,
        this.selectedLinesForActCreation,
        params
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

<style lang="scss" scoped></style>
