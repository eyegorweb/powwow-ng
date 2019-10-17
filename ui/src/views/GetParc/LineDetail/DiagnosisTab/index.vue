<template>
  <div class="row">
    <div class="col-md-3">
      <ul class="list-group">
        <li
          v-for="item in visibleMenuItems"
          :key="item.title"
          class="list-group-item"
          :class="{ '-inactive': !isLigneActive }"
        >
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
    <div class="col-md-9 pt-3" v-if="content">
      <template v-if="isLigneActive">
        <LineAnalysisSubMenu1 v-if="section === 'line_analysis'" :content="content" />
        <NetworkStatusSubMenu2 v-if="section === 'network_location_test'" :content="content" />
        <NetworkTestControl v-if="section === 'network_test_control'" :content="content" />
        <Supervision v-if="section === 'supervision'" :content="content" />
        <NetworkHistory v-if="section === 'network_history'" :content="content" />
        <LastTests v-if="section === 'last_tests'" :content="content" />
        <NetworkInformation v-if="section === 'network_information'" :content="content" />
      </template>
      <div v-else class="warning-message">
        <h3 class="text-warning text-center mt-5">
          {{ $t('getparc.lineDetail.tab2.lineAnalysisContent.inactiveLineWarning') }}
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
import LineAnalysisSubMenu1 from './LineAnalysisSubMenu1';
import NetworkStatusSubMenu2 from './NetworkStatusSubMenu2';
import NetworkTestControl from './NetworkTestControl';
import Supervision from './Supervision';
import NetworkHistory from './NetworkHistory';
import LastTests from './LastTests';
import NetworkInformation from './NetworkInformation';
import get from 'lodash.get';

export default {
  components: {
    LineAnalysisSubMenu1,
    NetworkStatusSubMenu2,
    NetworkTestControl,
    Supervision,
    NetworkHistory,
    LastTests,
    NetworkInformation,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      section: 'line_analysis',
      menuItems: [
        {
          section: 'line_analysis',
          title: 'getparc.lineDetail.tab2.lineAnalysis',
          compatiblePartnerTypes: ['M2M', 'CUSTOMER', 'MULTI_CUSTOMER'],
        },
        {
          section: 'network_location_test',
          title: 'getparc.lineDetail.tab2.networkLocationTest',
          compatiblePartnerTypes: ['M2M', 'CUSTOMER', 'MULTI_CUSTOMER'],
        },
        {
          section: 'network_test_control',
          title: 'getparc.lineDetail.tab2.networkTestControl',
          compatiblePartnerTypes: ['M2M', 'CUSTOMER', 'MULTI_CUSTOMER'],
        },
        {
          section: 'supervision',
          title: 'getparc.lineDetail.tab2.supervision',
          compatiblePartnerTypes: ['M2M', 'CUSTOMER', 'MULTI_CUSTOMER'],
        },
        {
          section: 'network_history',
          title: 'getparc.lineDetail.tab2.networkHistory',
          compatiblePartnerTypes: ['M2M', 'MVNO'],
        },
        {
          section: 'last_tests',
          title: 'getparc.lineDetail.tab2.lastTests',
          compatiblePartnerTypes: ['M2M', 'CUSTOMER', 'MULTI_CUSTOMER'],
        },
        {
          section: 'network_information',
          title: 'getparc.lineDetail.tab2.networkInformation',
          compatiblePartnerTypes: ['MVNO'],
        },
      ],
    };
  },
  computed: {
    isLigneActive() {
      const networkStatus = get(this.content, 'accessPoint.networkStatus');
      const simStatus = get(this.content, 'statuts');
      return simStatus === 'ALLOCATED' && networkStatus === 'ACTIVATED';
    },
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
  &.-inactive {
    pointer-events: none;
    background-color: $gray-400;
  }
  a {
    color: black;

    &.active {
      color: $primary;
    }
  }
}
</style>
