<template>
  <div v-if="!visibleMenuItems.length">{{ $t('noResult') }}</div>
  <div class="row" v-else>
    <div class="col-md-3">
      <ul class="list-group">
        <li
          v-for="item in visibleMenuItems"
          :key="item.title"
          class="list-group-item"
          :class="{ '-inactive': !isLineActive }"
        >
          <router-link :to="item.to" :class="{ active: $route.name == item.to.name }">
            {{ $t(item.title) }} <i class="ic-Arrow-Next-Icon float-right"></i>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="col-md-9 pt-3" v-if="content">
      <template v-if="isLineActive && content">
        <router-view :content="content" />
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
import { mapGetters } from 'vuex';

export default {
  props: {
    content: Object,
  },
  mounted() {
    this.menuItems = this.filterByPermission([
      {
        section: 'last_tests',
        title: 'getparc.lineDetail.tab2.lastTests',
        compatiblePartnerTypes: ['CUSTOMER', 'MULTI_CUSTOMER'],
        permission: { domain: 'getParc', action: 'manage_coach' },
        to: {
          name: 'lineDetail.diagnosis.last_tests',
          params: { lineId: this.$route.params.lineId, meta: this.content },
        },
      },
      {
        section: 'line_analysis',
        title: 'getparc.lineDetail.tab2.lineAnalysis',
        compatiblePartnerTypes: ['CUSTOMER', 'MULTI_CUSTOMER'],
        permission: { domain: 'getVision', action: 'read' },
        to: {
          name: 'lineDetail.diagnosis.analysis',
          params: { lineId: this.$route.params.lineId, meta: this.content },
        },
      },
      {
        section: 'network_location_test',
        title: 'getparc.lineDetail.tab2.networkLocationTest',
        compatiblePartnerTypes: ['CUSTOMER', 'MULTI_CUSTOMER'],
        permission: { domain: 'getVision', action: 'read' },
        to: {
          name: 'lineDetail.diagnosis.networkStatus',
          params: { lineId: this.$route.params.lineId, meta: this.content },
        },
      },
      {
        section: 'network_test_control',
        title: 'getparc.lineDetail.tab2.networkTestControl',
        compatiblePartnerTypes: ['CUSTOMER', 'MULTI_CUSTOMER'],
        permission: { domain: 'getVision', action: 'read' },
        to: {
          name: 'lineDetail.diagnosis.networkTestControl',
          params: { lineId: this.$route.params.lineId, meta: this.content },
        },
      },
      {
        section: 'supervision',
        title: 'getparc.lineDetail.tab2.supervision',
        compatiblePartnerTypes: ['CUSTOMER', 'MULTI_CUSTOMER'],
        permission: { domain: 'getVision', action: 'read' },
        to: {
          name: 'lineDetail.diagnosis.supervision',
          params: { lineId: this.$route.params.lineId, meta: this.content },
        },
      },
    ]);
    this.initializeSection();
  },
  data() {
    return {
      section: undefined,
      menuItems: undefined,
    };
  },
  computed: {
    ...mapGetters(['havePermission']),
    isLineActive() {
      const networkStatus = this.$loGet(this.content, 'accessPoint.networkStatus');
      const simStatus = this.$loGet(this.content, 'statuts');
      return (
        simStatus === 'ALLOCATED' &&
        (networkStatus === 'ACTIVATED' || networkStatus === 'SUSPENDED')
      );
    },
    visibleMenuItems() {
      const typeForPartner = this.$loGet(this.content, 'party.partyType');
      const specificCustomerID = this.$loGet(this.content, 'party.id');
      if (!this.menuItems) return [];
      let visibleItems = this.menuItems.filter(m =>
        m.compatiblePartnerTypes.some(p => p === typeForPartner)
      );
      const specificPermissionNetworkHistory = {
        section: 'network_history',
        title: 'getparc.lineDetail.tab2.networkHistory',
        to: {
          name: 'lineDetail.diagnosis.networkHistory',
          params: { lineId: this.$route.params.lineId, meta: this.content },
        },
      };

      // Conditions spécifiques avec notamment l'environnement de production pour afficher l'onglet Historique réseau et itinérance) => c'est donc "SALE"
      if (typeForPartner === 'MVNO') {
        visibleItems = [...visibleItems, specificPermissionNetworkHistory];
      } else if (typeForPartner === 'CUSTOMER' && this.havePermission('getVision', 'read')) {
        visibleItems = [...visibleItems, specificPermissionNetworkHistory];
      } else if (typeForPartner === 'MULTI_CUSTOMER' && this.havePermission('getVision', 'read')) {
        visibleItems = [...visibleItems, specificPermissionNetworkHistory];
      } else if (specificCustomerID === 246) {
        // partenaire IMT, détectable uniquement en environnement de production
        visibleItems = [...visibleItems, specificPermissionNetworkHistory];
      }

      return visibleItems;
    },
  },
  methods: {
    filterByPermission(arrayInput) {
      return arrayInput.filter(a => {
        if (!a.permission) return true;
        return this.havePermission(a.permission.domain, a.permission.action);
      });
    },
    initializeSection() {
      const typeForPartner = this.$loGet(this.content, 'party.partyType');
      if (typeForPartner === 'MVNO') {
        this.section = 'network_history';
      } else {
        if (this.havePermission('getVision', 'read')) {
          this.section = 'line_analysis';
        } else if (this.havePermission('getParc', 'manage_coach')) {
          this.section = 'last_tests';
        } else {
          this.section = 'network_history';
        }
      }
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
