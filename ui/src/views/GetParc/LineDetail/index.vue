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
          - {{ $t('getparc.lineDetail.title', { msisdn: msisdn }) }}
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
            <router-link :to="tab.to">{{ tab.title }}</router-link>
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

    this.tabs = [
      {
        label: 'detail',
        title: this.$t('getparc.lineDetail.title', { lineId: '' }),
        to: {
          name: 'lineDetail.details.info',
          params: { lineId: this.$route.params.lineId },
        },
      },
      {
        label: 'ongoing',
        title: this.$t('getparc.lineDetail.consuming'),

        to: {
          name: 'lineDetail.ongoing',
          params: { lineId: this.$route.params.lineId },
        },
      },
      {
        label: 'diagnosis',
        title: this.$t('getparc.lineDetail.analysingTool'), // ne pas afficher l'onglet si on n'a pas les permissions
        to: {
          name: 'lineDetail.diagnosis.analysis',
          params: { lineId: this.$route.params.lineId },
        },
      },
    ];
  },
  data() {
    return {
      lineData: undefined,
      partnerOptions: undefined,
      tabs: undefined,
      carouselItems: [],
      offerChangeEnabled: undefined,
      paramSearch: undefined,
    };
  },

  computed: {
    currentTabToShow() {
      if (this.$route.name.includes('ongoing')) return 1;
      if (this.$route.name.includes('diagnosis')) return 2;
      return 0;
    },
    ...mapGetters([
      'havePermission',
      'userIsBO',
      'userInfos',
      'userIsPartner',
      'havePermission',
      'userIsMultiCustomer',
    ]),

    canRunCoach() {
      return (
        this.havePermission('getParc', 'manage_coach') &&
        (this.userIsBO || this.$loGet(this.partnerOptions, 'coachM2MAvailable'))
      );
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

    canShowCarousel() {
      return this.carouselItems.length > 0;
    },
  },
  methods: {
    ...mapMutations(['openPanel']),

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
      this.$router.push({ name: 'actLines', params: { fromDetail: true } });
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

        if (this.userIsPartner || this.userInfos.type === 'PARTNER_GROUP') {
          this.offerChangeEnabled = this.partnerOptions
            ? this.partnerOptions.offerChangeEnabled
            : true;
        } else {
          this.offerChangeEnabled = true;
        }

        // if (this.lineData.party && this.lineData.party.partyType === 'MVNO') {

        //   this.consumption = await fetchCurrentConsumption({
        //     simCardInstanceId: this.$route.params.lineId,
        //   });
        // }

        if (this.lineData.party && this.lineData.party.partyType !== 'MVNO') {
          this.carouselItems = excludeMocked([
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
              icon: 'ic-Wallet-Icon',
              title: 'getparc.actCreation.carouselItem.lineDetail.CHANGE_CF',
              selected: false,
              permission: { domain: 'act', action: 'transfer_customer_account' },
              hideForMultiCustomer: true,
            },
            {
              icon: 'ic-Ticket-Icon',
              title: 'getparc.actCreation.carouselItem.lineDetail.CHANGE_OFFER',
              selected: false,
              permission: { domain: 'act', action: 'manage_main' },
            },
          ])
            .filter(i => {
              if (i.hideForMultiCustomer) {
                return !this.userIsMultiCustomer;
              }
              return true;
            })
            .filter(i => {
              if (i.permission) {
                return this.havePermission(i.permission.domain, i.permission.action);
              }
              return true;
            })
            .filter(i => {
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
          ]).filter(i => {
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
