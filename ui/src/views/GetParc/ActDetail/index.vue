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
          - {{ $t('getparc.management-act-detail') }}
          <i class="ic-Info-Icon" />
        </h4>
      </div>
    </div>
    <ActHistoryDetailPage v-if="massAction" :content="massAction" />
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
        <FailedTable
          :mass-action-id="$route.params.massActionId"
          :rows="tabs[0].rows"
          @refreshTables="refreshTables"
        />
      </div>
      <div slot="ongoing">
        <OngoingTable :mass-action-id="$route.params.massActionId" :rows="tabs[1].rows" />
      </div>
      <div slot="finished">
        <FinishedTable :mass-action-id="$route.params.massActionId" :rows="tabs[2].rows" />
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
import { fetchUnitActions } from '@/api/unitActions';
import { searchMassActionsById } from '@/api/massActions';

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
    this.refreshTables();
    this.refreshCurrentMassAction();
  },

  data() {
    return {
      currentLinkIndex: 0,
      massAction: null,
      tabs: [
        {
          label: 'fail',
          status: 'KO',
          title: this.$t('getparc.actDetail.titleListCard.FAIL'),
          total: 0,
          rows: [],
        },
        {
          label: 'ongoing',
          status: 'SENT', // WAITING, SENT, IN_PROGRESS
          title: this.$t('getparc.actDetail.titleListCard.ONGOING'),
          total: 0,
          rows: [],
        },
        {
          label: 'finished',
          status: 'OK', // OK, REPLAYED, CANCELLED
          title: this.$t('getparc.actDetail.titleListCard.TERMINATED'),
          total: 0,
          rows: [],
        },
      ],
    };
  },
  methods: {
    async refreshTables() {
      const pagination = { limit: 20, page: 0 };
      const orderBy = { key: 'id', direction: 'DESCENDING' };
      const failedCards = await fetchUnitActions(
        this.$route.params.massActionId,
        'KO',
        pagination,
        orderBy
      );
      const ongoingCards = await fetchUnitActions(
        this.$route.params.massActionId,
        'SENT',
        pagination,
        orderBy
      );

      const sentCards = await fetchUnitActions(
        this.$route.params.massActionId,
        'OK',
        pagination,
        orderBy
      );

      this.tabs = [
        {
          ...this.tabs[0],
          rows: failedCards,
          total: failedCards ? failedCards.length : 0,
        },
        {
          ...this.tabs[1],
          rows: ongoingCards,
          total: ongoingCards ? ongoingCards.length : 0,
        },
        {
          ...this.tabs[2],
          rows: sentCards,
          total: sentCards ? sentCards.length : 0,
        },
      ];
      this.refreshCurrentMassAction();
    },
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
    async refreshCurrentMassAction() {
      const data = await searchMassActionsById(this.$route.params.massActionId);
      if (data) {
        this.massAction = data.massActionResponse;
      }
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

.back-btn {
  color: $gray-680;
}
</style>
