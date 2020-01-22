<template>
  <LoaderContainer :is-loading="isLoading">
    <div slot="on-loading">
      <SearchResultSkeleton :columns="columns" />
    </div>
    <div class="row mb-3 mt-3">
      <div class="col-md-8">
        <h2 class="text-gray font-weight-light" style="font-size: 2rem">
          {{ $t('getvsion.table.total', { total: total }) }}
        </h2>
      </div>
      <div class="col-md-4">
        <ff-wip>
          <UiButton variant="secondary" block class="float-right" @click="createAlarm()">
            <i class="select-icon ic-Amplifier-Icon" />
            {{ $t('getvsion.table.create-alarm') }}
          </UiButton>
        </ff-wip>
      </div>
    </div>
    <template v-if="rows && rows.length">
      <DataTable
        :columns="columns"
        :rows="rows || []"
        :page.sync="page"
        :page-limit.sync="pageLimit"
        :total="total || 0"
        :order-by.sync="orderBy"
        :show-extra-columns.sync="showExtraCells"
        :size="7"
      >
        <template slot="topLeftCorner">
          <SearchAlarmById
            :init-value="searchedId"
            @search="isSearchingById = true"
            @searchById="searchById"
          />
        </template>
        <template slot="actions" slot-scope="{ row }">
          <AlarmsActions :alarm="row" />
        </template>
      </DataTable>
    </template>
    <template v-else>
      <div v-if="isSearchingById">
        <button class="btn btn-link" @click="resetFilters">{{ $t('resetFilters') }}</button>
      </div>
      <div class="alert alert-light">{{ $t('noResult') }}</div>
    </template>
  </LoaderContainer>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import UiButton from '@/components/ui/Button';
import { col } from '@/components/DataTable/utils';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

import AlarmNameCell from './AlarmNameCell.vue';
import ThresholdCell from './ThresholdCell.vue';
import TargetedLinesCell from './TargetedLinesCell.vue';
import TriggeredEventsCell from './TriggeredEventsCell.vue';
import AlarmIdCell from './AlarmIdCell.vue';
import SearchAlarmById from './SearchAlarmById.vue';
import AlarmsActions from './AlarmsActions.vue';

import LoaderContainer from '@/components/LoaderContainer';
import SearchResultSkeleton from '@/components/ui/skeletons/SearchResultSkeleton';

export default {
  components: {
    LoaderContainer,
    SearchResultSkeleton,
    DataTable,
    UiButton,
    SearchAlarmById,
    AlarmsActions,
  },
  data() {
    return {
      showExtraCells: false,
      columns: [
        col(this.$t('col.id'), 'id', true, true, {
          component: AlarmIdCell,
        }),
        col(this.$t('getparc.lineDetail.alarms.name'), 'name', true, false, {
          component: AlarmNameCell,
        }),
        col(this.$t('getvsion.table.thresholds'), 'thresholds', true, false, {
          component: ThresholdCell,
        }),
        col(this.$t('getvsion.table.targetedLines'), 'targetedLines', true, false, {
          component: TargetedLinesCell,
        }),
        col(this.$t('getvsion.table.triggers '), 'triggers', true, false, {
          component: TriggeredEventsCell,
        }),
      ],
      pageLimit: 20,
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      isSearchingById: false,
      searchedId: undefined,
    };
  },
  computed: {
    ...mapState('alarms', ['searchResponse', 'searchPage']),
    ...mapGetters('alarms', ['appliedFilters', 'isLoading']),
    page: {
      get() {
        return this.searchPage || 0;
      },
      set(newVal) {
        this.setPage(newVal);
      },
    },
    getPageInfo() {
      return { page: this.page - 1, limit: this.pageLimit };
    },
    total() {
      return this.searchResponse ? this.searchResponse.total : 0;
    },
    rows() {
      return this.searchResponse ? this.searchResponse.items : [];
    },
  },
  watch: {
    searchPage() {
      this.fetchAlarms();
    },
    orderBy() {
      this.page = 1;
      this.fetchAlarms();
    },
    pageLimit() {
      this.page = 1;
      this.fetchAlarms();
    },
    appliedFilters() {
      this.fetchAlarms();
    },
  },
  mounted() {
    this.fetchAlarms();
  },
  methods: {
    ...mapActions('alarms', ['fetchAlarmsFromApi']),
    ...mapMutations('alarms', [
      'setPage',
      'setCurrentFilters',
      'applyFilters',
      'forceAppliedFilters',
      'startLoading',
      'stopLoading',
    ]),
    ...mapMutations(['openPanel']),

    createAlarm() {
      this.openPanel({
        title: this.$t('getvsion.table.create-alarm'),
        panelId: 'getvsion.table.create-alarm',
        wide: true,
        backdrop: true,
        ignoreClickAway: true,
      });
    },
    async fetchAlarms() {
      this.startLoading();
      await this.fetchAlarmsFromApi({
        orderBy: this.orderBy,
        pageInfo: this.getPageInfo,
        appliedFilters: this.appliedFilters,
      });
      this.stopLoading();
    },
    resetFilters() {
      this.isSearchingById = false;
      this.searchedId = undefined;
      this.forceAppliedFilters([]);
    },

    searchById(value) {
      if (!value) {
        this.resetFilters();
      }
      this.searchedId = value;
      this.forceAppliedFilters([
        {
          id: 'filters.alarmId',
          value,
        },
      ]);
    },
  },
};
</script>

<style lang="scss" scoped></style>
