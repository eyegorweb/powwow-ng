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
            <img v-if="loadingTotals" class="loader" src="@/assets/spinner.svg" />

            <span
              v-if="!loadingTotals"
              class="badge badge-pill"
              :class="{
                'badge-danger': index === 0,
                'badge-info': index === 1,
                'badge-success': index === 2,
              }"
              >{{ tab.total }}</span
            >
          </a>
        </UiTab>
      </template>
      <div slot="fail">
        <FailedTable
          :key="'tab1'"
          :mass-action-id="$route.params.massActionId"
          @refreshTables="refreshTables"
          :total.sync="tabs[0].total"
        />
      </div>
      <div slot="ongoing">
        <UnitActsTable
          storage-id="getparc.actdetail.ongoing"
          storage-version="001"
          :key="'tab2'"
          :mass-action-id="$route.params.massActionId"
          :statuses="['WAITING', 'SENT', 'IN_PROGRESS']"
          :total.sync="tabs[1].total"
        />
      </div>
      <div slot="finished">
        <UnitActsTable
          storage-id="getparc.actdetail.finished"
          storage-version="001"
          :key="'tab3'"
          :mass-action-id="$route.params.massActionId"
          :statuses="['OK']"
          :total.sync="tabs[2].total"
        />
      </div>
    </UiTabs>
  </div>
</template>

<script>
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';
import FailedTable from './FailedTable';
import UnitActsTable from './UnitActsTable';
import ActHistoryDetailPage from '@/views/GetParc/ActHistory/ActHistoryDetailPage';
import { searchMassActionsById } from '@/api/massActions';
import { fetchUnitActionsTotals } from '@/api/unitActions';
import get from 'lodash.get';

export default {
  components: {
    UiTabs,
    UiTab,
    FailedTable,
    ActHistoryDetailPage,
    UnitActsTable,
  },

  async mounted() {
    this.refreshTables();
  },

  data() {
    return {
      currentLinkIndex: 0,
      massAction: null,
      loadingTotals: false,
      tabs: [
        {
          label: 'fail',
          title: this.$t('getparc.actDetail.titleListCard.FAIL'),
          total: '-',
        },
        {
          label: 'ongoing',
          title: this.$t('getparc.actDetail.titleListCard.ONGOING'),
          total: '-',
        },
        {
          label: 'finished',
          title: this.$t('getparc.actDetail.titleListCard.TERMINATED'),
          total: '-',
        },
      ],
    };
  },
  methods: {
    async refreshTables() {
      this.refreshCurrentMassAction();
      this.loadingTotals = true;
      const totals = await fetchUnitActionsTotals(this.$route.params.massActionId);
      this.loadingTotals = false;

      if (totals) {
        this.tabs = [
          {
            ...this.tabs[0],
            total: get(totals, 'failed.total', 0),
          },
          {
            ...this.tabs[1],
            total: get(totals, 'ongoing.total', 0),
          },
          {
            ...this.tabs[2],
            total: get(totals, 'finished.total', 0),
          },
        ];
      }
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
        this.massAction = data;
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

.loader {
  width: 30px;
}
</style>
