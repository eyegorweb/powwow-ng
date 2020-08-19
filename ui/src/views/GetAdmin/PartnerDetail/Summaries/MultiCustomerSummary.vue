<template>
  <div class="row mb-4">
    <div class="col">
      <div class="bg-white p-4 rounded">
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getadmin.partnerDetail.mb.entity') }}:</h6>
            <p>{{ getFromContent('party.name') }}</p>
          </div>
          <div class="item">
            <h6>{{ $t('getadmin.partnerDetail.mb.accountGroup') }}:</h6>
            <p>{{ getFromContent('party.partyGroups.name') }}</p>
          </div>
          <div class="item">
            <h6>{{ $t('getadmin.partnerDetail.mb.contractReference') }}:</h6>
            <p>{{ getFromContent('party.contractReference') }}</p>
          </div>
          <div class="item">
            <h6>{{ $t('getadmin.partnerDetail.mb.nbCustomers') }}::</h6>
            <p>{{ getFromContent('customerAccountsCount') }}</p>
          </div>
          <div class="item">
            <h6>{{ $t('filters.lines.typeSIMCard') }}:</h6>
            <p>{{ getFromContent('availableSimCount') }}</p>
          </div>
          <div class="item">
            <h6>{{ $t('getadmin.partners.broadcastList') }}:</h6>
            <p>{{ getFromContent('mailingListsCount') }}</p>
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
      const value = get(this.partyDetail, path, defaultValue);
      return value !== null ? value : '-';
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
