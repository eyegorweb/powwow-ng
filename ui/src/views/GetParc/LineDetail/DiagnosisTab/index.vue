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
import { isFeatureAvailable } from '@/api/partners';

export default {
  props: {
    content: Object,
  },
  async mounted() {
    this.autoDiagnosticEnabled = await isFeatureAvailable(
      'AUTODIAGNOSTIC_ENABLED',
      this.content.id
    );

    const geolocEnabled = await isFeatureAvailable('GEOLOCATION_ENABLED', this.content.id);

    const requestConsoActive = await isFeatureAvailable('REQUEST_CONSO_ENABLED', this.content.id);

    const unfilteredItems = [
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
    ];

    this.menuItems = this.filterByPermission(unfilteredItems).filter((i) => {
      if (i.section === 'line_analysis' || i.section === 'supervision') {
        return this.autoDiagnosticEnabled;
      }
      if (i.section === 'network_location_test') {
        return geolocEnabled;
      }
      if (i.section === 'network_test_control') {
        return requestConsoActive;
      }
      return true;
    });

    this.initializeSection();
  },
  data() {
    return {
      section: undefined,
      menuItems: undefined,
      autoDiagnosticEnabled: false,
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
      let visibleItems = this.menuItems.filter((m) =>
        m.compatiblePartnerTypes.some((p) => p === typeForPartner)
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
      const shouldAddSpecificPermission =
        typeForPartner === 'MVNO' ||
        (typeForPartner === 'CUSTOMER' && this.havePermission('getVision', 'read')) ||
        (typeForPartner === 'MULTI_CUSTOMER' && this.havePermission('getVision', 'read')) ||
        specificCustomerID === 246; // partenaire IMT, détectable uniquement en environnement de production

      if (shouldAddSpecificPermission) {
        visibleItems = [...visibleItems, specificPermissionNetworkHistory];
      }

      return visibleItems;
    },
  },
  methods: {
    filterByPermission(arrayInput) {
      return arrayInput.filter((a) => {
        if (!a.permission) return true;
        return this.havePermission(a.permission.domain, a.permission.action);
      });
    },
    gotoRoute(name) {
      if (this.$route.name !== name) {
        this.$router.push({
          name,
          params: { lineId: this.$route.params.lineId, meta: this.content },
        });
      }
    },
    initializeSection() {
      const typeForPartner = this.$loGet(this.content, 'party.partyType');

      if (typeForPartner === 'MVNO') {
        this.gotoRoute('lineDetail.diagnosis.networkHistory');
      } else {
        if (this.havePermission('getVision', 'read') && this.autoDiagnosticEnabled) {
          this.gotoRoute('lineDetail.diagnosis.analysis');
        } else if (this.havePermission('getParc', 'manage_coach')) {
          this.gotoRoute('lineDetail.diagnosis.last_tests');
        } else {
          this.gotoRoute('lineDetail.diagnosis.networkHistory');
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
