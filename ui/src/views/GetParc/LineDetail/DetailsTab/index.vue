<template>
  <div class="row">
    <div class="col-md-3">
      <ul class="list-group">
        <li v-for="item in visibleMenuItems" :key="item.title" class="list-group-item">
          <a
            @click.prevent="section = item.section"
            :class="{ active: section == item.section }"
            href="#"
          >
            {{ $t(item.title) }}
            <i class="ic-Arrow-Next-Icon float-right"></i>
          </a>
        </li>
      </ul>
    </div>
    <div class="col-md-9">
      <LineInfoSection v-if="section === 'line_info' && content" :content="content" />
      <ActsHistory v-if="section === 'acts_history'" :content="content" />
      <LineServicesSection v-if="section === 'line_services'" :content="content" />
      <BillingSection v-if="section === 'billing'" :content="content" />
      <AlarmList v-if="section === 'alarm_list'" :content="content" />
    </div>
  </div>
</template>

<script>
import LineInfoSection from './LineInfoSection';
import LineServicesSection from './LineServicesSection';
import BillingSection from './BillingSection';
import ActsHistory from './ActsHistory';
import AlarmList from './AlarmList';

import get from 'lodash.get';

export default {
  components: {
    LineInfoSection,
    LineServicesSection,
    BillingSection,
    ActsHistory,
    AlarmList,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      section: 'line_info',
      menuItems: [
        {
          section: 'line_info',
          title: 'getparc.lineDetail.tab1.lineInfo',
          compatiblePartnerTypes: ['CUSTOMER', 'MVNO', 'MULTI_CUSTOMER'],
        },
        {
          section: 'billing',
          title: 'getparc.lineDetail.tab1.billingOffer.title',
          compatiblePartnerTypes: ['CUSTOMER', 'MVNO', 'MULTI_CUSTOMER'],
        },
        {
          section: 'line_services',
          title: 'getparc.lineDetail.tab1.lineServices',
          compatiblePartnerTypes: ['CUSTOMER', 'MVNO', 'MULTI_CUSTOMER'],
        },
        {
          section: 'alarm_list',
          title: 'getparc.lineDetail.tab1.alarmsList',
          compatiblePartnerTypes: ['CUSTOMER', 'MULTI_CUSTOMER'],
        },
        {
          section: 'acts_history',
          title: 'getparc.lineDetail.tab1.actsHistory',
          compatiblePartnerTypes: ['CUSTOMER', 'MVNO', 'MULTI_CUSTOMER'],
        },
      ],
    };
  },
  computed: {
    visibleMenuItems() {
      const typeForPartner = get(this.content, 'party.partyType');
      let visibleItems = this.menuItems.filter(m =>
        m.compatiblePartnerTypes.some(p => p === typeForPartner)
      );
      return visibleItems;
    },
  },
};
</script>

<style lang="scss" scoped>
.list-group-item {
  a {
    color: black;

    &.active {
      color: $primary;
    }
  }
}
</style>
