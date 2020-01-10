<template>
  <div class="mt-4">
    <div class="row">
      <div class="col-md-9">
        <button @click.prevent="$router.go(-1)" class="btn btn-link back-btn">
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
    </div>
    <LineSummary v-if="lineData" :content="lineData" />
    <ActionCarousel
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
import { searchLines } from '@/api/linesActions';
import { mapMutations } from 'vuex';
import get from 'lodash.get';
import { excludeMocked } from '@/featureFlipping/plugin';

export default {
  components: {
    LineSummary,
    DetailsTab,
    OngoingTab,
    ActionCarousel,
    DiagnosisTab,
    UiTabs,
    UiTab,
  },
  mounted() {
    this.loadLineData();
  },
  data() {
    return {
      lineData: undefined,
      currentLinkIndex: 0,
      tabs: [
        {
          label: 'detail',
          title: this.$t('getparc.lineDetail.title', { lineId: '' }),
          total: 0,
        },
        {
          label: 'ongoing',
          title: this.$t('getparc.lineDetail.consuming'),
          total: 0,
        },
        {
          label: 'diagnosis',
          title: this.$t('getparc.lineDetail.analysingTool'),
          total: 0,
        },
      ],
      carouselItems: excludeMocked([
        {
          icon: 'ic-Sim-Icon',
          title: 'getparc.actCreation.carouselItem.lineDetail.CHANGE_SIMCARD',
          selected: false,
        },
        {
          icon: 'ic-Smartphone-Icon',
          title: 'getparc.actCreation.carouselItem.lineDetail.CHANGE_MSISDN',
          selected: false,
        },
        {
          icon: 'ic-Edit-Icon',
          title: 'getparc.actCreation.carouselItem.lineDetail.CUSTOM_FIELDS',
          selected: false,
        },
        {
          icon: 'ic-Wallet-Icon',
          title: 'getparc.actCreation.carouselItem.lineDetail.CHANGE_CF',
          selected: false,
        },
        {
          icon: 'ic-Ticket-Icon',
          title: 'getparc.actCreation.carouselItem.lineDetail.CHANGE_OFFER',
          selected: false,
        },
      ]),
    };
  },
  computed: {
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
  },
  methods: {
    ...mapMutations(['openPanel']),

    onCarouselItemClick(item) {
      this.openPanel({
        title: this.$t(item.title),
        panelId: 'getparc.actLines.details.createAct',
        payload: { ...item, lineData: this.lineData },
        wide: false,
        backdrop: false,
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
