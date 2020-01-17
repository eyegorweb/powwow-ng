<template>
  <ActFormEmptyContainer
    :validate-fn="validate"
    success-message="getparc.actCreation.transfertCF.successMessage"
  >
    <div slot="main" slot-scope="{ containerValidationFn }">
      <BillingAccountChoice
        :key="actCreationPrerequisites.partner.id"
        :partner-id="actCreationPrerequisites.partner.id"
        @set:billingAccount="setBillingAccount"
        :errors="errors"
      />
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
      </div>
    </div>
  </ActFormEmptyContainer>
</template>

<script>
import ActFormEmptyContainer from './parts/ActFormEmptyContainer2';
import BillingAccountChoice from './parts/BillingAccountChoice';
import { mapState, mapGetters } from 'vuex';
import UiDate from '@/components/ui/UiDate';
import moment from 'moment';
import UiCheckbox from '@/components/ui/Checkbox';
import { changeCustomerAccount } from '@/api/actCreation';

export default {
  components: {
    ActFormEmptyContainer,
    BillingAccountChoice,
    UiDate,
    UiCheckbox,
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
    ...mapGetters(['userInfos']),

    canChangeDate() {
      if (!this.actCreationPrerequisites || !this.actCreationPrerequisites.partner) return false;
      return this.actCreationPrerequisites.partner.partyType === 'MVNO' || this.isPartnerMVNO;
    },
    canSend() {
      if (this.chosenBillingAccount && this.chosenBillingAccount.id) return true;
      return false;
    },
    isPartnerMVNO() {
      if (!this.userInfos || !this.userInfos.roles) return;
      const found = this.userInfos.roles.find(r => {
        return r.name === 'mvno';
      });
      console.log('found', !!found);
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
  mounted() {
    this.actDate = moment().format('DD/MM/YYYY');
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
        dueDate: this.actDate,

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
