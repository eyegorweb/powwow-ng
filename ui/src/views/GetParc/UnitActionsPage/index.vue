<template>
  <LoaderContainer :is-loading="isLoading">
    <div slot="on-loading">
      <PageSkeleton />
    </div>
    <div class="mt-4 bottom-space">
      <div class="row">
        <div class="col-md-9">
          <button
            @click.prevent="backRoute"
            class="btn btn-link back-btn"
          >
            <i class="ic-Arrow-Previous-Icon" />
            {{ $t('back') }}
          </button>
        </div>
      </div>
      <div class="row mb-5">
        <div class="col-md-9">
          <h4>
            <b>GetParc</b>
            {{ massActionsTitleInfos }}
            <i class="ic-Info-Icon" />
          </h4>
        </div>
      </div>
      <ActHistoryDetailPage v-if="massAction" :content="massAction" @cancelled="refreshTables" />
      <UiTabs :tabs="tabs" :selected-index="currentLinkIndex">
        <template slot-scope="{ tab, index, selectedIndex }">
          <UiTab v-if="tab" :is-selected="index === selectedIndex" class="tab-grow">
            <a href="#" @click.prevent="() => (currentLinkIndex = index)">
              {{ tab.title }}
              <img v-if="tab.isLoading" class="loader" src="@/assets/spinner.svg" />

              <span
                v-if="!tab.isLoading"
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
            :total="$loGet(massAction, 'failedEntitiesNumber', 0)"
            @refreshTables="refreshTables"
          />
        </div>
        <div slot="ongoing">
          <PendingTable :total="$loGet(massAction, 'pendingEntitiesNumber', 0)" />
        </div>
        <div slot="finished">
          <FinishedTable :total="$loGet(massAction, 'completedEntitiesNumber', 0)" />
        </div>
      </UiTabs>
    </div>
  </LoaderContainer>
</template>

<script>
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';
import FailedTable from './FailedTable';
import ActHistoryDetailPage from '@/views/GetParc/MassActionsPage/ActHistoryDetailPage';
import { searchMassActionsById } from '@/api/massActions';
import get from 'lodash.get';
import { formatLargeNumber } from '@/utils/numbers';
import FinishedTable from './FinishedTable';
import PendingTable from './PendingTable';
import PageSkeleton from './PageSkeleton';
import LoaderContainer from '@/components/LoaderContainer';

export default {
  components: {
    UiTabs,
    UiTab,
    FailedTable,
    ActHistoryDetailPage,
    FinishedTable,
    PendingTable,
    LoaderContainer,
    PageSkeleton,
  },

  async mounted() {
    this.refreshTables();
  },
  data() {
    return {
      isLoading: true,
      currentLinkIndex: this.$route.params.index || 0,
      massAction: null,
      tabs: [
        {
          label: 'fail',
          title: this.$t('getparc.actDetail.titleListCard.FAIL'),
          total: '-',
          isLoading: false,
        },
        {
          label: 'ongoing',
          title: this.$t('getparc.actDetail.titleListCard.ONGOING'),
          total: '-',
          isLoading: false,
        },
        {
          label: 'finished',
          title: this.$t('getparc.actDetail.titleListCard.TERMINATED'),
          total: '-',
          isLoading: false,
        },
      ],
    };
  },
  methods: {
    async refreshTables() {
      this.isLoading = true;
      await this.refreshCurrentMassAction();
      this.isLoading = false;

      this.tabs = [
        {
          ...this.tabs[0],
          total: this.formattedTotal(get(this.massAction, 'failedEntitiesNumber', 0)),
        },
        {
          ...this.tabs[1],
          total: this.formattedTotal(get(this.massAction, 'pendingEntitiesNumber', 0)),
        },
        {
          ...this.tabs[2],
          total: this.formattedTotal(get(this.massAction, 'completedEntitiesNumber', 0)),
        },
      ];
    },
    getMassActionItem(response) {
      if (response) {
        const foundItem = response.find(
          (f) => f.massActionResponse.id === this.$route.params.massActionId
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
    formattedTotal(total) {
      return formatLargeNumber(total);
    },
  },
  computed: {
    backRoute() {
      return this.$route.params.simpleBack 
      ? this.$router.go(-1) 
      : this.$router.push({ name: 'actHistory', params: { queryFilters: filters } })
    },
    filters() {
      return this.$loGet(this.$route, 'params.actHistoryTableFilters');
    },
    massActionsTitleInfos() {
      return this.massAction
        ? `- ${this.$t('getparc.management-act-detail')} - Acte N° ${
            this.massAction.massAction.id
          } - ${this.massAction.type}`
        : '';
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
