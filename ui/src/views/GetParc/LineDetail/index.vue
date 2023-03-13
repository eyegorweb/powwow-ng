<template>
  <div class="mt-4">
    <div class="row">
      <div class="col-md-9">
        <button @click.prevent="returnToSearch()" class="btn btn-link back-btn">
          <i class="ic-Arrow-Previous-Icon" />
          {{ $t('back') }}
        </button>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-md-9">
        <h4>
          <b>GetParc</b>
          - {{ $t('getparc.lineDetail.title', { lineId: iccid }) }}
          <i class="ic-Info-Icon" />
        </h4>
      </div>
      <div v-if="canRunCoach" class="col-md-3">
        <UiButton variant="secondary" block class="float-right" @click="openCoachPanel()">
          <i class="ic-Heart-Rythm-Icon"></i>
          {{ $t('getparc.lineDetail.startCoach') }}
        </UiButton>
      </div>
    </div>
    <LineSummary v-if="lineData" :content="lineData" />
    <ActionCarousel
      v-if="lineData && canShowCarousel"
      :actions="carouselItems"
      :default-disabled="!isLigneActive"
      @itemClick="onCarouselItemClick"
    />
    <div v-if="tabs && lineData" class="mt-4 mb-4">
      <UiTabs :tabs="tabs">
        <template slot-scope="{ tab, index }">
          <UiTab v-if="tab" :is-selected="index === currentTabToShow" class="tab-grow">
            <router-link v-if="index !== currentTabToShow" :to="tab.to">{{
              $t(tab.title)
            }}</router-link>
            <a @click="(e) => e.preventDefault()" v-else>{{ $t(tab.title) }}</a>
          </UiTab>
        </template>
      </UiTabs>

      <div class="pt-4 pl-4">
        <router-view :content="lineData" />
      </div>
    </div>
  </div>
</template>

<script>
import LineSummary from './LineSummary';
import ActionCarousel from '../ActLines/ActionCarousel';
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';
import UiButton from '@/components/ui/Button';

import { searchLines } from '@/api/linesActions';
import { mapGetters, mapMutations } from 'vuex';
import get from 'lodash.get';
import { excludeMocked } from '@/featureFlipping/plugin';
import { getPartyOptions } from '@/api/partners.js';
import { getFromLatestLineFromAccessPoint } from '@/utils/line.js';
import { fetchOffers } from '@/api/offers.js';
import { isFeatureAvailable } from '@/api/partners';

export default {
  components: {
    LineSummary,
    ActionCarousel,
    UiTabs,
    UiTab,
    UiButton,
  },
  async mounted() {
    await this.loadLineData();
    this.typeForPartner = this.$loGet(this.lineData, 'party.partyType');
    this.specificCustomerID = this.$loGet(this.lineData, 'party.id');
    this.coachM2Mavailable = await isFeatureAvailable('COACH_M2M_AVAILABLE', this.lineData.id);
    this.autoDiagnosticEnabled = await isFeatureAvailable(
      'AUTODIAGNOSTIC_ENABLED',
      this.lineData.id
    );
    this.geolocEnabled = await isFeatureAvailable('GEOLOCATION_ENABLED', this.lineData.id);
    this.requestConsoActive = await isFeatureAvailable('REQUEST_CONSO_ENABLED', this.lineData.id);

    this.tabs = [
      {
        label: 'detail',
        title: 'getparc.lineDetail.header',
        to: {
          name: 'lineDetail.details.info',
          meta: { label: 'Détail de la ligne - Informations' },
          params: { lineId: this.$route.params.lineId },
        },
      },
      {
        label: 'ongoing',
        title: 'getparc.lineDetail.consuming',

        to: {
          name: 'lineDetail.ongoing',
          meta: { label: 'Détail de la ligne - En cours de consommation' },
          params: { lineId: this.$route.params.lineId },
        },
      },
    ];

    if (this.initControlMenuGetDiag()) {
      this.tabs = [
        ...this.tabs,
        {
          label: 'diagnosis',
          title: 'getparc.lineDetail.analysingTool',
          to: {
            // Route par défaut à l'initialisation
            name: 'lineDetail.diagnosis.analysis',
            meta: {
              label: 'Détail de la ligne - Analyser la ligne',
              hasDependantPermission: true,
              permission: [
                { domain: 'getParc', action: 'read' },
                { domain: 'getVision', action: 'read' },
              ],
              compatiblePartnerTypes: ['CUSTOMER', 'MULTI_CUSTOMER'],
            },
            query: {
              partnerType: this.typeForPartner,
              autoDiagnosticEnabled: this.autoDiagnosticEnabled,
            },
            params: { lineId: this.$route.params.lineId },
          },
        },
      ];
    }
  },
  data() {
    return {
      lineData: undefined,
      partnerOptions: undefined,
      tabs: undefined,
      carouselItems: [],
      offerChangeEnabled: undefined,
      paramSearch: undefined,
      hasPermissionForDiag: undefined,
      typeForPartner: undefined,
      coachM2Mavailable: undefined,
      autoDiagnosticEnabled: undefined,
      geolocEnabled: undefined,
      specificCustomerID: undefined,
      requestConsoActive: undefined,
      controls: [],
    };
  },

  computed: {
    ...mapGetters(['userIsAdmin']),
    currentTabToShow() {
      if (this.$route.name.includes('ongoing')) return 1;
      if (this.$route.name.includes('diagnosis')) return 2;
      return 0;
    },
    ...mapGetters([
      'userIsBO',
      'userIsMVNO',
      'havePermission',
      'userIsMultiCustomer',
      'userIsM2MLight',
    ]),

    canRunCoach() {
      return this.showCoachMenu;
    },

    isLigneActive() {
      const networkStatus = get(this.lineData, 'accessPoint.networkStatus');
      const simStatus = get(this.lineData, 'statuts');
      return simStatus === 'ALLOCATED' && networkStatus === 'ACTIVATED';
    },

    msisdn() {
      return this.lineData &&
        this.lineData.accessPoint &&
        typeof this.lineData.accessPoint !== 'undefined' &&
        this.lineData.accessPoint !== 'null'
        ? getFromLatestLineFromAccessPoint(this.lineData.accessPoint, 'msisdn')
        : '';
    },

    iccid() {
      return this.lineData ? get(this.lineData, 'iccid') : '';
    },

    canShowCarousel() {
      return this.carouselItems.length > 0;
    },

    // last_tests menu
    showCoachMenu() {
      return (
        this.havePermission('getParc', 'manage_coach') &&
        this.isCompatibleForPartner(['CUSTOMER', 'MULTI_CUSTOMER', 'M2M_LIGHT']) &&
        this.coachM2Mavailable
      );
    },

    // line_analysis menu
    showLineAnalysisMenu() {
      return (
        this.havePermission('getVision', 'read') &&
        this.isCompatibleForPartner(['CUSTOMER', 'MULTI_CUSTOMER']) &&
        this.autoDiagnosticEnabled
      );
    },

    // network_location_test menu
    showNetworkTestMenu() {
      return (
        this.havePermission('getVision', 'read') &&
        this.isCompatibleForPartner(['CUSTOMER', 'MULTI_CUSTOMER']) &&
        this.geolocEnabled
      );
    },

    // network_test_control menu
    showNetworkControlMenu() {
      return (
        this.havePermission('getVision', 'read') &&
        this.isCompatibleForPartner(['CUSTOMER', 'MULTI_CUSTOMER']) &&
        this.requestConsoActive
      );
    },

    // supervision menu
    showSupervisionMenu() {
      return (
        this.havePermission('getVision', 'read') &&
        this.isCompatibleForPartner(['CUSTOMER', 'MULTI_CUSTOMER']) &&
        this.autoDiagnosticEnabled
      );
    },

    // network_history menu
    // Conditions spécifiques avec notamment l'environnement de production pour afficher l'onglet Historique réseau et itinérance)
    showNetworkHistorynMenu() {
      const shouldAddSpecificPermission =
        (this.typeForPartner === 'MVNO' && this.havePermission('getVision', 'read')) ||
        (this.typeForPartner === 'CUSTOMER' && this.havePermission('getVision', 'read')) ||
        (this.typeForPartner === 'MULTI_CUSTOMER' && this.havePermission('getVision', 'read')) ||
        // partenaire IMT, détectable uniquement en environnement de production
        this.specificCustomerID === 246;

      return shouldAddSpecificPermission;
    },
  },
  methods: {
    ...mapMutations(['openPanel']),

    initControlMenuGetDiag() {
      return (
        this.showCoachMenu ||
        this.showLineAnalysisMenu ||
        this.showNetworkTestMenu ||
        this.showNetworkControlMenu ||
        this.showSupervisionMenu ||
        this.showNetworkHistorynMenu
      );
    },

    isCompatibleForPartner(compatiblePartnerTypes) {
      return compatiblePartnerTypes.some((p) => p === this.typeForPartner);
    },

    openCoachPanel() {
      this.openPanel({
        title: this.$t('coach.title'),
        panelId: 'coach.title',
        payload: { ...this.lineData, msisdn: this.msisdn },
        wide: false,
        backdrop: false,
        ignoreClickAway: true,
        width: '45rem',
      });
    },

    returnToSearch() {
      this.$router.push({ name: 'actLines', params: { fromDetail: true } }).catch(() => {});
    },

    onCarouselItemClick(item) {
      this.openPanel({
        title: this.$t(item.title),
        panelId: 'getparc.actLines.details.createAct',
        payload: { ...item, lineData: this.lineData },
        wide: false,
        backdrop: false,
        ignoreClickAway: true,
      });
    },

    async loadLineData() {
      if (this.$route.params && this.$route.params.lineId) {
        this.paramSearch = [
          {
            id: 'filters.id',
            value: this.$route.params.lineId,
          },
        ];
      } else if (this.$route.params && this.$route.params.lineIccid) {
        this.paramSearch = [
          {
            id: 'filters.iccid',
            value: this.$route.params.lineIccid,
          },
        ];
      }
      const response = await searchLines(
        { key: 'id', direction: 'DESC' },
        { page: 0, limit: 1 },
        this.paramSearch
      );
      if (!response || !response.items || !response.items.length) return;
      this.lineData = response.items[0];

      if (this.lineData) {
        const partnerId = get(this.lineData, 'party.id');
        if (partnerId) {
          this.partnerOptions = await getPartyOptions(partnerId);
        }

        this.offerChangeEnabled = this.partnerOptions
          ? this.partnerOptions.offerChangeEnabled
          : undefined;

        if (this.lineData.party && this.lineData.party.partyType !== 'MVNO') {
          const availableOffers = await fetchOffers('', [{ id: this.lineData.party.id }], {
            page: 0,
            limit: 20,
            customerAccountCode:
              this.partnerOptions.defaultCustomerForActivation &&
              this.partnerOptions.defaultCustomerForActivation.code
                ? this.partnerOptions.defaultCustomerForActivation.code
                : undefined,
          });

          let preCarouselItems = [
            {
              icon: 'ic-Sim-Icon',
              title: 'getparc.actCreation.carouselItem.lineDetail.CHANGE_SIMCARD',
              selected: false,
              permission: { domain: 'act', action: 'manage_main' },
            },
            {
              icon: 'ic-Smartphone-Icon',
              title: 'getparc.actCreation.carouselItem.lineDetail.CHANGE_MSISDN',
              selected: false,
              permission: { domain: 'act', action: 'msisdn_change' },
            },
            {
              icon: 'ic-Edit-Icon',
              title: 'getparc.actCreation.carouselItem.lineDetail.CUSTOM_FIELDS',
              selected: false,
              permission: { domain: 'act', action: 'manage_main' },
            },
            {
              icon: 'ic-Ticket-Icon',
              title: 'getparc.actCreation.carouselItem.lineDetail.CHANGE_OFFER',
              selected: false,
              isDisable: () => {
                if (
                  (availableOffers && availableOffers.length <= 1) ||
                  availableOffers.errors ||
                  !this.offerChangeEnabled
                ) {
                  return true;
                }
                return false;
              },
              permission: { domain: 'act', action: 'manage_main' },
            },
          ];
          if (this.$loGet(this.lineData, 'party.partyType') !== 'MULTI_CUSTOMER') {
            preCarouselItems.splice(3, 0, {
              icon: 'ic-Wallet-Icon',
              title: 'getparc.actCreation.carouselItem.lineDetail.CHANGE_CF',
              selected: false,
              permission: { domain: 'act', action: 'transfer_customer_account' },
              hideForMultiCustomer: true,
            });
          }
          this.carouselItems = excludeMocked(preCarouselItems)
            .filter((i) => {
              if (i.hideForMultiCustomer) {
                return !this.userIsMultiCustomer;
              }
              return true;
            })
            .filter((i) => {
              if (i.permission) {
                return this.havePermission(i.permission.domain, i.permission.action);
              }
              return true;
            })
            .filter((i) => {
              if (this.userIsM2MLight) {
                return i.title === 'getparc.actCreation.carouselItem.lineDetail.CUSTOM_FIELDS';
              }
              return true;
            })
            .filter((i) => {
              if (i.title === 'getparc.actCreation.carouselItem.lineDetail.CHANGE_OFFER') {
                return this.offerChangeEnabled;
              }
              return true;
            });
        } else {
          this.carouselItems = excludeMocked([
            {
              icon: 'ic-Sim-Icon',
              title: 'getparc.actCreation.carouselItem.lineDetail.CHANGE_SIMCARD',
              selected: false,
              permission: { domain: 'act', action: 'msisdn_change' },
            },
          ]).filter((i) => {
            if (i.permission) {
              return this.havePermission(i.permission.domain, i.permission.action);
            }
            return true;
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-grow {
  flex-grow: 1;
}
a {
  text-transform: uppercase;
}
</style>
