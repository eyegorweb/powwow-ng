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
    this.refreshTables();
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
        },
        {
          label: 'ongoing',
          status: 'OK',
          title: this.$t('getparc.actDetail.titleListCard.ONGOING'),
          total: 0,
          rows: [],
        },
        {
          label: 'finished',
          status: 'SENT',
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
        'OK',
        pagination,
        orderBy
      );

      const sentCards = await fetchUnitActions(
        this.$route.params.massActionId,
        'SENT',
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
