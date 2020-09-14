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
        <UiButton variant="secondary" block class="float-right" @click="createAlarm()">
          <i class="select-icon ic-Amplifier-Icon" />
          {{ $t('getvsion.table.create-alarm') }}
        </UiButton>
      </div>
    </div>
    <template v-if="rows && rows.length">
      <DataTable
        :storage-id="storageId"
        storage-version="005"
        :columns="columns"
        :rows="rows || []"
        :page.sync="page"
        :page-limit.sync="pageLimit"
        :total="total || 0"
        :order-by.sync="orderBy"
        :show-extra-columns.sync="showExtraCells"
        :size="5"
      >
        <template slot="topLeftCorner">
          <SearchAlarmById
            :init-value="searchedId"
            @search="isSearchingById = true"
            @searchById="searchById"
          />
        </template>
        <template slot="actions" slot-scope="{ row }">
          <AlarmsActions :alarm="row" @actionIsDone="fetchAlarms()" />
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
import TriggeredEventsCell from './TriggeredEventsCell.vue';
import AlarmIdCell from './AlarmIdCell.vue';
import AlarmStatusCell from './AlarmStatusCell.vue';
import AlarmsActions from './AlarmsActions.vue';
import SearchAlarmById from './SearchAlarmById.vue';

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
        col(this.$t('col.id'), 'id', true, false, {
          component: AlarmIdCell,
        }),
        col(this.$t('getparc.lineDetail.alarms.name'), 'name', true, false, {
          component: AlarmNameCell,
        }),
        col(this.$t('getvsion.table.thresholds'), 'thresholds', true, false, {
          component: ThresholdCell,
        }),
        col(this.$t('getvsion.table.targetedLines'), 'numberOfTargetedLines', true, false),
        col(this.$t('getvsion.table.triggers'), 'triggers', false, false, {
          component: TriggeredEventsCell,
        }),
        col(this.$t('filters.lines.activationDate'), 'startDate', false, false),
        col(this.$t('col.partner'), 'party', false, false, {
          type: 'ObjectAttribute',
          path: 'name',
        }),
        col(this.$t('getvsion.table.alarmStatus'), 'startDate', true, false, {
          component: AlarmStatusCell,
        }),
        col(this.$t('getparc.lineDetail.offer'), 'autoPositionWorkflow', false, false, {
          type: 'ObjectAttribute',
          path: 'workflowDescription',
        }),
        col(this.$t('common.billingAccount'), 'autoPositionCustAccount', false, false, {
          type: 'ObjectAttribute',
          path: 'name',
        }),
        {
          id: 2,
          label: this.$t('getparc.lineDetail.alarms.observationCycle'),
          orderable: false,
          visible: false,
          name: 'observationCycle',
          noHandle: true,
          format: {
            type: 'Getter',
            getter: row => {
              return this.$t('alarms.observationCycles.' + row.observationCycle);
            },
          },
        },
        {
          id: 3,
          label: this.$t('getvsion.filters.ALARMS_OFFER'),
          orderable: false,
          visible: false,
          name: 'alarmScope',
          noHandle: true,
          format: {
            type: 'Getter',
            getter: row => {
              return this.$t('alarms.alarmScope.' + row.alarmScope);
            },
          },
        },
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
    ...mapGetters(['userName']),
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
    storageId() {
      return this.userName + 'getvision.alarms';
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
      const doReset = () => {
        this.page = 1;
        this.fetchAlarms();
      };
      this.openPanel({
        title: this.$t('getvsion.table.create-alarm'),
        panelId: 'getvsion.table.create-alarm',
        wide: true,
        backdrop: true,
        ignoreClickAway: true,
        onClosePanel(params) {
          if (params && params.resetSearch) {
            doReset();
          }
        },
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
