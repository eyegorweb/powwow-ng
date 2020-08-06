<template>
  <div class="row mb-4">
    <div class="col">
      TODO: Modifier le résumé pour multi customer
      <div class="bg-white p-4 rounded">
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getadmin.partners.name') }}:</h6>
            <p>{{ getFromContent('party.name') }}</p>
          </div>
          <div class="item">
            <h6>{{ $t('filters.lines.siren') }}:</h6>
            <p>{{ getFromContent('party.siren') }}</p>
          </div>
          <div class="item">
            <h6>{{ $t('filters.lines.typeSIMCard') }}:</h6>
            <p>{{ getFromContent('availableSimCount') }}</p>
          </div>
          <div class="item">
            <h6>{{ $t('common.customFields') }}:</h6>
            <p>{{ getFromContent('customFieldsCount') }}</p>
          </div>
        </div>
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getadmin.partners.mainAdmin') }}:</h6>
            <p>
              {{ getFromContent('party.mainAdministrator.name.firstName')
              }}{{ getFromContent('party.mainAdministrator.name.lastName') }}
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getadmin.partners.users') }}:</h6>
            <p>{{ getFromContent('usersCount') }}</p>
          </div>
          <div class="item">
            <h6>{{ $t('getadmin.partners.deliveryPlaces') }}:</h6>
            <p>{{ getFromContent('shippingAddressesCount') }}</p>
          </div>
          <div class="item">
            <h6>{{ $t('getadmin.partners.broadcastList') }}:</h6>
            <p>{{ getFromContent('mailingListsCount') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      &nbsp;
      <div class="bg-white p-4 rounded">
        <div class="d-flex secondSummary">
          <div class="item">
            <h6>{{ $t('getadmin.partners.salesEngineer') }}:</h6>
            <p>{{ getFromContent('salesEngineer') }}</p>
          </div>
          <div class="item">
            <h6>{{ $t('common.email') }}:</h6>
            <p>{{ getFromContent('mainAdministrator.contactInformation.email') }}</p>
          </div>
          <div class="item">
            <h6>{{ $t('orders.new.deliveryStep.form.phone') }}</h6>
            <p>{{ getFromContent('mainAdministrator.contactInformation.phone') }}</p>
          </div>
        </div>
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getadmin.partners.lastBill') }}:</h6>
            <p>
              {{ getFromContent('lastBillingAmount.billDate') }} :
              {{ billNumberFormatter(getFromContent('lastBillingAmount.amount', 0)) }} €
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('filters.offers') }}:</h6>
            <p>{{ getFromContent('workflowsCount') }}</p>
          </div>
          <div class="item">
            <h6>{{ $t('common.billingAccounts') }}:</h6>
            <p>{{ getFromContent('customerAccountsCount') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatLargeNumber } from '@/utils/numbers';
import get from 'lodash.get';

export default {
  props: {
    partyDetail: Object,
  },

  methods: {
    getFromContent(path, defaultValue = '-') {
      return get(this.partyDetail, path, defaultValue);
    },
    billNumberFormatter(n) {
      return n ? formatLargeNumber(n) : '0';
    },
  },
};
</script>

<style lang="scss" scoped>
hr {
  border-bottom: 1px dashed #dddddd;
  margin-top: 0;
  margin-bottom: 0.8rem;
}
.secondSummary {
  .item {
    width: 33%;
  }
}
.item {
  margin-right: 0.5rem;
  flex-grow: 1;
  width: 25%;
  h6 {
    color: #7d7d7d;
    font-size: 0.8rem;
    font-weight: 400;
  }
}
</style>
