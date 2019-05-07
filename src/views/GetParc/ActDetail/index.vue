<template>
  <div class="mt-4">
    <ActHistoryDetailPage :content="row" />
    <UiTabs :tabs="tabs" :selected-index="currentLinkIndex">
      <template slot-scope="{ tab, index, selectedIndex }">
        <UiTab v-if="tab" :is-selected="index === selectedIndex" class="tab-grow">
          <a href="#" @click.prevent="() => (currentLinkIndex = index)">
            {{ tab.title }}
            <span
              class="badge badge-pill"
              :class="{
                'badge-danger': index === 0,
                'badge-info': index === 1,
                'badge-success': index === 2,
              }"
            >
              {{ tab.total }}
            </span>
          </a>
        </UiTab>
      </template>
      <div slot="fail">
        <FailedTable :mass-action-id="$route.params.massActionId" :rows="tabs[0].rows" :total="tabs[0].total" />
      </div>
      <div slot="ongoing">
        <OngoingTable :mass-action-id="$route.params.massActionId" :rows="tabs[1].rows" :total="tabs[1].total" />
      </div>
      <div slot="finished">
        <FinishedTable :mass-action-id="$route.params.massActionId" :rows="tabs[2].rows" :total="tabs[2].total" />
      </div>
    </UiTabs>
  </div>
</template>

<script>
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';
import FailedTable from './FailedTable';
import OngoingTable from './OngoingTable';
import FinishedTable from './FinishedTable';
import ActHistoryDetailPage from '@/views/GetParc/ActHistory/ActHistoryDetailPage';
import { mapGetters } from 'vuex';
import { fetchUnitActions } from '@/api/unitActions';

export default {
  components: {
    UiTabs,
    UiTab,
    FailedTable,
    OngoingTable,
    FinishedTable,
    ActHistoryDetailPage,
  },

  async mounted() {
    const pagination = { limit: 20, page: 0 };
    const orderBy = { key: 'id', direction: 'DESCENDING' };
    this.tabs[0].rows = await fetchUnitActions(
      this.$route.params.massActionId,
      this.tabs[0].status,
      pagination,
      orderBy
    );
    this.tabs[0].total = this.tabs[0].rows ? this.tabs[0].rows.length : 0;
    this.tabs[1].rows = await fetchUnitActions(
      this.$route.params.massActionId,
      this.tabs[1].status,
      pagination,
      orderBy
    );
    this.tabs[1].total = this.tabs[1].rows ? this.tabs[1].rows.length : 0;
    this.tabs[2].rows = await fetchUnitActions(
      this.$route.params.massActionId,
      this.tabs[2].status,
      pagination,
      orderBy
    );
    this.tabs[2].total = this.tabs[2].rows ? this.tabs[2].rows.length : 0;
  },

  data() {
    return {
      currentLinkIndex: 0,
      tabs: [
        {
          label: 'fail',
          status: 'KO',
          title: this.$t('getparc.actDetail.titleListCard.FAIL'),
          total: 0,
          rows: [],
          // rows: [
          //   {
          //     id: '567990324433324',
          //     msisdn: '33761456934',
          //     iccid: '8933200809935003869',
          //     actState: 'Ancienne offre: ENEDYS-LINKY-PROD',
          //     failDate: '18/11/2018 14:56:09',
          //     failReason: `Le changement d'offre est invalide`,
          //     imsi: '0123',
          //     constructor: 'NOKIA',
          //     commercialRef: 'ref001',
          //     imei: '1234',
          //   },
          // ],
        },
        {
          label: 'ongoing',
          status: 'OK',
          title: this.$t('getparc.actDetail.titleListCard.ONGOING'),
          total: 0,
          rows: [],
          // rows: [
          //   {
          //     id: '567990324433324',
          //     msisdn: '33761456934',
          //     iccid: '8933200809935003869',
          //     actState: 'Ancienne offre: ENEDYS-LINKY-PROD',
          //     startDate: '18/11/2018 14:56:09',
          //     imsi: '0123',
          //     constructor: 'NOKIA',
          //     commercialRef: 'ref001',
          //     imei: '1234',
          //   },
          // ],
        },
        {
          label: 'finished',
          status: 'SENT',
          title: this.$t('getparc.actDetail.titleListCard.TERMINATED'),
          total: 0,
          rows: [],
          // rows: [
          //   {
          //     id: '567990324433324',
          //     msisdn: '33761456934',
          //     iccid: '8933200809935003869',
          //     actState: 'Ancienne offre: ENEDYS-LINKY-PROD',
          //     startDate: '18/11/2018 14:56:09',
          //     endDate: '20/11/2018 16:56:09',
          //     imsi: '0123',
          //     constructor: 'NOKIA',
          //     commercialRef: 'ref001',
          //     imei: '1234',
          //   },
          // ],
        },
      ],
    };
  },
  methods: {
    getMassActionItem(response) {
      if (response) {
        const foundItem = response.find(
          f => f.massActionResponse.id === this.$route.params.massActionId
        );
        if (foundItem) {
          return foundItem.massActionResponse;
        }
      }
    },
  },
  computed: {
    ...mapGetters('actHistory', ['massActionsResponse']),
    row() {
      return this.massActionsResponse ? this.getMassActionItem(this.massActionsResponse.items) : {};
    },
  },
};
</script>

<style scoped lang="scss">
.tab-grow {
  flex-grow: 1;
}
a {
  text-transform: uppercase;
}
</style>
