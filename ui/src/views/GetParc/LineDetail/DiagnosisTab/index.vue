<template>
  <div v-if="!visibleMenuItems.length">{{ $t('noResult') }}</div>
  <div class="row" v-else>
    <div class="col-md-3">
      <ul class="list-group">
        <li
          v-for="item in visibleMenuItems"
          :key="item.title"
          class="list-group-item"
          :class="({ '-inactive': !isLineActive }, `menu_${item.section}`)"
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
    this.typeForPartner = this.$loGet(this.content, 'party.partyType');
    this.coachM2MAvailable = await isFeatureAvailable('COACH_M2M_AVAILABLE', this.content.id);
    this.geolocEnabled = await isFeatureAvailable('GEOLOCATION_ENABLED', this.content.id);
    this.requestConsoActive = await isFeatureAvailable('REQUEST_CONSO_ENABLED', this.content.id);

    const unfilteredItems = [
      {
        section: 'last_tests',
        title: 'getparc.lineDetail.tab2.lastTests',
        compatiblePartnerTypes: ['CUSTOMER', 'MULTI_CUSTOMER', 'M2M_LIGHT'],
        permission: { domain: 'getParc', action: 'manage_coach' },
        to: {
          name: 'lineDetail.diagnosis.last_tests',
          meta: { label: 'Détail de la ligne - Derniers tests Coach M2M' },
          params: { lineId: this.$route.params.lineId, meta: this.content },
          query: { partnerType: this.typeForPartner, coachM2MAvailable: this.coachM2MAvailable },
        },
      },
      {
        section: 'line_analysis',
        title: 'getparc.lineDetail.tab2.lineAnalysis',
        compatiblePartnerTypes: ['CUSTOMER', 'MULTI_CUSTOMER'],
        permission: { domain: 'getVision', action: 'read' },
        to: {
          name: 'lineDetail.diagnosis.analysis',
          meta: { label: 'Détail de la ligne - Analyser la ligne' },
          params: { lineId: this.$route.params.lineId, meta: this.content },
          query: {
            partnerType: this.typeForPartner,
            autoDiagnosticEnabled: this.autoDiagnosticEnabled,
          },
        },
      },
      {
        section: 'network_location_test',
        title: 'getparc.lineDetail.tab2.networkLocationTest',
        compatiblePartnerTypes: ['CUSTOMER', 'MULTI_CUSTOMER'],
        permission: { domain: 'getVision', action: 'read' },
        to: {
          name: 'lineDetail.diagnosis.networkStatus',
          meta: { label: 'Détail de la ligne - Tester le réseau et la localisation' },
          params: { lineId: this.$route.params.lineId, meta: this.content },
          query: { partnerType: this.typeForPartner, geolocEnabled: this.geolocEnabled },
        },
      },
      {
        section: 'network_test_control',
        title: 'getparc.lineDetail.tab2.networkTestControl',
        compatiblePartnerTypes: ['CUSTOMER', 'MULTI_CUSTOMER'],
        permission: { domain: 'getVision', action: 'read' },
        to: {
          name: 'lineDetail.diagnosis.networkTestControl',
          meta: { label: 'Détail de la ligne - Tester et contrôler la consommation' },
          params: { lineId: this.$route.params.lineId, meta: this.content },
          query: { partnerType: this.typeForPartner, requestConsoActive: this.requestConsoActive },
        },
      },
      {
        section: 'supervision',
        title: 'getparc.lineDetail.tab2.supervision',
        compatiblePartnerTypes: ['CUSTOMER', 'MULTI_CUSTOMER'],
        permission: { domain: 'getVision', action: 'read' },
        to: {
          name: 'lineDetail.diagnosis.supervision',
          meta: { label: 'Détail de la ligne - Supervision' },
          params: { lineId: this.$route.params.lineId, meta: this.content },
          query: {
            partnerType: this.typeForPartner,
            autoDiagnosticEnabled: this.autoDiagnosticEnabled,
          },
        },
      },
    ];

    this.menuItems = this.filterByPermission(unfilteredItems).filter((i) => {
      if (i.section === 'last_tests') {
        return this.coachM2MAvailable;
      }
      if (i.section === 'line_analysis' || i.section === 'supervision') {
        return this.autoDiagnosticEnabled;
      }
      if (i.section === 'network_location_test') {
        return this.geolocEnabled;
      }
      if (i.section === 'network_test_control') {
        return this.requestConsoActive;
      }
      return true;
    });

    this.initializeSection();
  },
  data() {
    return {
      section: undefined,
      menuItems: undefined,
      typeForPartner: undefined,
      autoDiagnosticEnabled: false,
      coachM2MAvailable: false,
      geolocEnabled: false,
      requestConsoActive: false,
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
      const specificCustomerID = this.$loGet(this.content, 'party.id');
      if (!this.menuItems) return [];
      let visibleItems = this.menuItems.filter((m) =>
        m.compatiblePartnerTypes.some((p) => p === this.typeForPartner)
      );
      const specificPermissionNetworkHistory = {
        section: 'network_history',
        title: 'getparc.lineDetail.tab2.networkHistory',
        compatiblePartnerTypes: ['MVNO', 'CUSTOMER', 'MULTI_CUSTOMER'],
        to: {
          name: 'lineDetail.diagnosis.networkHistory',
          meta: { label: 'Détail de la ligne - Historique réseau et itinérance' },
          params: { lineId: this.$route.params.lineId, meta: this.content },
          compatiblePartnerTypes: ['MVNO', 'CUSTOMER', 'MULTI_CUSTOMER'],
          query: { partnerType: this.typeForPartner, specificCustomerID },
        },
      };

      // Conditions spécifiques avec notamment l'environnement de production pour afficher l'onglet Historique réseau et itinérance) => c'est donc "SALE"
      const shouldAddSpecificPermission =
        (this.typeForPartner === 'MVNO' && this.havePermission('getVision', 'read')) ||
        (this.typeForPartner === 'CUSTOMER' && this.havePermission('getVision', 'read')) ||
        (this.typeForPartner === 'MULTI_CUSTOMER' && this.havePermission('getVision', 'read')) ||
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
      let query = {};
      // Rediriger vers name: lineDetail.diagnosis.analysis (route par défaut de l'onglet GetDiag) si permission getVison/read
      // Sinon si pas permission getVision/read et permission getParc/manage_coach, rediriger vers lineDetail.diagnosis.last_tests
      // Paramètres de permission pour naviguer jusqu'à cette route
      if (this.havePermission('getVision', 'read')) {
        query = {
          partnerType: this.typeForPartner,
          autoDiagnosticEnabled: this.autoDiagnosticEnabled,
        };
      } else if (
        !this.havePermission('getVision', 'read') &&
        this.havePermission('getParc', 'manage_coach')
      ) {
        query = {
          partnerType: this.typeForPartner,
          coachM2MAvailable: this.coachM2MAvailable,
        };
      }

      if (this.$route.name !== name) {
        this.$router
          .push({
            name,
            params: {
              lineId: this.$route.params.lineId,
              meta: this.content,
              hasDependantPermission: true,
            },
            query,
          })
          .catch(() => {});
      }
    },
    // Pas de redirection sur l'url par défaut si la route va vers les liens paramétrés
    shouldIgnoreRedirect() {
      if (this.$loGet(this.$route, 'params.createTestRequest')) return true;
      if (this.$loGet(this.$route, 'params.createPingRequest')) return true;
      return false;
    },
    initializeSection() {
      const specificCustomerID = this.$loGet(this.content, 'party.id');
      // Conditions spécifiques avec notamment l'environnement de production pour afficher l'onglet Historique réseau et itinérance) => c'est donc "SALE"
      const networkHistorySpecificPermission =
        (this.typeForPartner === 'MVNO' && this.havePermission('getVision', 'read')) ||
        (this.typeForPartner === 'CUSTOMER' && this.havePermission('getVision', 'read')) ||
        (this.typeForPartner === 'MULTI_CUSTOMER' && this.havePermission('getVision', 'read')) ||
        specificCustomerID === 246;

      if (!this.shouldIgnoreRedirect()) {
        if (networkHistorySpecificPermission) {
          this.gotoRoute('lineDetail.diagnosis.networkHistory');
        } else {
          if (this.havePermission('getVision', 'read') && this.autoDiagnosticEnabled) {
            this.gotoRoute('lineDetail.diagnosis.analysis');
          } else if (this.havePermission('getParc', 'manage_coach') && this.coachM2MAvailable) {
            this.gotoRoute('lineDetail.diagnosis.last_tests');
          } else {
            this.gotoRoute('home');
          }
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
