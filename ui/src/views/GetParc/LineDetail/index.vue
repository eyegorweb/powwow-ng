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
    <div class="mt-4 mb-4">
      <UiTabs :tabs="tabs" :selected-index="currentLinkIndex">
        <template slot-scope="{ tab, index, selectedIndex }">
          <UiTab v-if="tab" :is-selected="index === selectedIndex" class="tab-grow">
            <a href="#" @click.prevent="() => (currentLinkIndex = index)">{{ tab.title }}</a>
          </UiTab>
        </template>
        <div class="pt-4 pl-4" slot="detail">
          <DetailsTab :content="lineData" />
        </div>
        <div slot="ongoing">
          <OngoingTab :content="lineData" />
        </div>
        <div slot="diagnosis">
          <DiagnosisTab :content="lineData" />
        </div>
      </UiTabs>
    </div>
  </div>
</template>

<script>
import LineSummary from './LineSummary';
import DetailsTab from './DetailsTab';
import OngoingTab from './OngoingTab';
import DiagnosisTab from './DiagnosisTab';
import ActionCarousel from '../ActLines/ActionCarousel';
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';
import UiButton from '@/components/ui/Button';

import { searchLines } from '@/api/linesActions';
import { mapGetters, mapMutations } from 'vuex';
import get from 'lodash.get';
import { excludeMocked } from '@/featureFlipping/plugin';
import { getPartyOptions } from '@/api/partners.js';

export default {
  components: {
    LineSummary,
    DetailsTab,
    OngoingTab,
    ActionCarousel,
    DiagnosisTab,
    UiTabs,
    UiTab,
    UiButton,
  },
  async mounted() {
    if (this.$route.params && this.$route.params.tabIndex) {
      this.currentLinkIndex = this.$route.params.tabIndex;
    }
    await this.loadLineData();
    await this.loadLinePartnerPartnerOptions();
  },
  data() {
    return {
      lineData: undefined,
      currentLinkIndex: 0,
      partnerOptions: undefined,
      tabs: [
        {
          label: 'detail',
          title: this.$t('getparc.lineDetail.title', { lineId: '' }),
        },
        {
          label: 'ongoing',
          title: this.$t('getparc.lineDetail.consuming'),
        },
        {
          label: 'diagnosis',
          title: this.$t('getparc.lineDetail.analysingTool'), // ne pas afficher l'onglet si on n'a pas les permissions
        },
      ],
      carouselItems: [],
    };
  },
  computed: {
    ...mapGetters(['userInfos', 'havePermission']),

    canRunCoach() {
      if (this.partnerOptions) {
        return this.partnerOptions.coachM2MAvailable;
      }

      return false;
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
        ? this.lineData.accessPoint.lines[0].msisdn
        : '';
    },

    canShowCarousel() {
      return this.carouselItems.length > 0;
    },

    offerChangeEnabled() {
      return this.partnerOptions ? this.partnerOptions.offerChangeEnabled : true;
    },
  },
  methods: {
    ...mapMutations(['openPanel']),

    async loadLinePartnerPartnerOptions() {
      if (this.lineData) {
        const partnerId = get(this.lineData, 'party.id');
        if (partnerId) {
          this.partnerOptions = await getPartyOptions(partnerId);
        }
        // condition spécifique pour afficher le changement d'offre
        this.carouselItems = this.carouselItems.filter(i => {
          if (i.title === 'getparc.actCreation.carouselItem.lineDetail.CHANGE_OFFER') {
            return this.offerChangeEnabled;
          }
          return true;
        });
      }
    },

    openCoachPanel() {
      this.openPanel({
        title: this.$t('coach.title'),
        panelId: 'coach.title',
        payload: this.lineData,
        wide: false,
        backdrop: false,
        ignoreClickAway: true,
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
      const response = await searchLines({ key: 'id', direction: 'DESC' }, { page: 0, limit: 1 }, [
        {
          id: 'filters.id',
          value: this.$route.params.lineId,
        },
      ]);
      if (!response || !response.items || !response.items.length) return;
      this.lineData = response.items[0];
      if (this.lineData.party.partyType !== 'MVNO') {
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
          },
          {
            icon: 'ic-Ticket-Icon',
            title: 'getparc.actCreation.carouselItem.lineDetail.CHANGE_OFFER',
            selected: false,
            permission: { domain: 'act', action: 'manage_main' },
          },
        ]);
      } else {
        this.carouselItems = excludeMocked([
          {
            icon: 'ic-Sim-Icon',
            title: 'getparc.actCreation.carouselItem.lineDetail.CHANGE_SIMCARD',
            selected: false,
            permission: { domain: 'act', action: 'msisdn_change' },
          },
        ]);
      }
      this.carouselItems = this.carouselItems.filter(i => {
        if (i.permission) {
          return this.havePermission(i.permission.domain, i.permission.action);
        }
        return true;
      });
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
