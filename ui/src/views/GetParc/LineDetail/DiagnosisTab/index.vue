<template>
  <div class="row">
    <div class="col-md-3">
      <ul class="list-group">
        <li
          v-for="item in visibleMenuItems"
          :key="item.title"
          class="list-group-item"
          :class="{ '-inactive': !menuActive }"
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
    <div class="col-md-9">
      <LineAnalysis
        v-if="section === 'line_analysis'"
        :content="content"
        :menu-active.sync="menuActive"
      />
      <NetworkLocationTest
        v-if="section === 'network_location_test'"
        :content="content"
        :menu-active.sync="menuActive"
      />
      <NetworkTestControl
        v-if="section === 'network_test_control'"
        :content="content"
        :menu-active.sync="menuActive"
      />
      <Supervision
        v-if="section === 'supervision'"
        :content="content"
        :menu-active.sync="menuActive"
      />
      <NetworkHistory
        v-if="section === 'network_history'"
        :content="content"
        :menu-active.sync="menuActive"
      />
      <LastTests
        v-if="section === 'last_tests'"
        :content="content"
        :menu-active.sync="menuActive"
      />
      <NetworkInformation
        v-if="section === 'network_information'"
        :content="content"
        :menu-active.sync="menuActive"
      />
    </div>
  </div>
</template>

<script>
import LineAnalysis from './LineAnalysis';
import NetworkLocationTest from './NetworkLocationTest';
import NetworkTestControl from './NetworkTestControl';
import Supervision from './Supervision';
import NetworkHistory from './NetworkHistory';
import LastTests from './LastTests';
import NetworkInformation from './NetworkInformation';
import get from 'lodash.get';

export default {
  components: {
    LineAnalysis,
    NetworkLocationTest,
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
      menuActive: true,
      section: 'line_analysis',
      menuItems: [
        {
          section: 'line_analysis',
          title: 'getparc.lineDetail.tab2.lineAnalysis',
          partnerForType: ['M2M', 'CUSTOMER'],
        },
        {
          section: 'network_location_test',
          title: 'getparc.lineDetail.tab2.networkLocationTest',
          partnerForType: ['M2M', 'CUSTOMER'],
        },
        {
          section: 'network_test_control',
          title: 'getparc.lineDetail.tab2.networkTestControl',
          partnerForType: ['M2M', 'CUSTOMER'],
        },
        {
          section: 'supervision',
          title: 'getparc.lineDetail.tab2.supervision',
          partnerForType: ['M2M', 'CUSTOMER'],
        },
        {
          section: 'network_history',
          title: 'getparc.lineDetail.tab2.networkHistory',
          partnerForType: ['MVNO'],
        },
        {
          section: 'last_tests',
          title: 'getparc.lineDetail.tab2.lastTests',
          partnerForType: ['M2M', 'CUSTOMER'],
        },
        {
          section: 'network_information',
          title: 'getparc.lineDetail.tab2.networkInformation',
          partnerForType: ['MVNO'],
        },
      ],
    };
  },
  computed: {
    visibleMenuItems() {
      const typeForPartner = get(this.content, 'party.partyType');
      let visibleItems = this.menuItems.filter(m =>
        m.partnerForType.some(p => p === typeForPartner)
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
