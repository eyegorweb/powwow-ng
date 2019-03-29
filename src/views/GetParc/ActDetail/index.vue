<template>
  <div class="mt-4">
    <ActHistoryDetailPage />
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
        <FailedTable :rows="tabs[0].rows" :total="tabs[0].total" />
      </div>
      <div slot="ongoing">
        <OngoingTable :rows="tabs[1].rows" :total="tabs[1].total" />
      </div>
      <div slot="finished">
        <FinishedTable :rows="tabs[2].rows" :total="tabs[2].total" />
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

export default {
  components: {
    UiTabs,
    UiTab,
    FailedTable,
    OngoingTable,
    FinishedTable,
    ActHistoryDetailPage,
  },
  data() {
    return {
      currentLinkIndex: 0,
      tabs: [
        {
          label: 'fail',
          title: 'LISTE DES CARTES EN ÉCHEC',
          total: 1,
          rows: [
            {
              id: '567990324433324',
              msisdn: '33761456934',
              iccid: '8933200809935003869',
              actState: 'Ancienne offre: ENEDYS-LINKY-PROD',
              failDate: '18/11/2018 14:56:09',
              failReason: `Le changement d'offre est invalide`,
              imsi: '0123',
              constructor: 'NOKIA',
              commercialRef: 'ref001',
              imei: '1234',
            },
          ],
        },
        {
          label: 'ongoing',
          title: 'LISTE DES CARTES EN COURS',
          total: 1,
          rows: [
            {
              id: '567990324433324',
              msisdn: '33761456934',
              iccid: '8933200809935003869',
              actState: 'Ancienne offre: ENEDYS-LINKY-PROD',
              startDate: '18/11/2018 14:56:09',
              imsi: '0123',
              constructor: 'NOKIA',
              commercialRef: 'ref001',
              imei: '1234',
            },
          ],
        },
        {
          label: 'finished',
          title: 'LISTE DES CARTES TERMINÉES',
          total: 1,
          rows: [
            {
              id: '567990324433324',
              msisdn: '33761456934',
              iccid: '8933200809935003869',
              actState: 'Ancienne offre: ENEDYS-LINKY-PROD',
              startDate: '18/11/2018 14:56:09',
              endDate: '20/11/2018 16:56:09',
              imsi: '0123',
              constructor: 'NOKIA',
              commercialRef: 'ref001',
              imei: '1234',
            },
          ],
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
.tab-grow {
  flex-grow: 1;
}
</style>
