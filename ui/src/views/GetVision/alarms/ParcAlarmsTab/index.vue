<template>
  <div class="mt-4">
    <TableWithFilter
      :key="version"
      v-if="columns && filters"
      :filters="filters"
      :columns="columns"
      :is-loading="isLoading"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :size="5"
      @applyFilters="applyFilters"
      @currentFiltersChange="currentFilters = $event"
      :default-values="defaultFilterValues"
      @resetFilters="resetFilters"
    >
      <div slot="title" class="mt-2">{{ $t('getvsion.table.total', { total: total }) }}</div>
      <div slot="topRight" class="mt-2">
        <div class="row d-flex flex-row-reverse">
          <div class="col-md-6">
            <UiButton variant="secondary" block class="float-right" @click="createAlarm()">
              <i class="select-icon ic-Amplifier-Icon" />
              {{ $t('getvsion.table.create-alarm') }}
            </UiButton>
          </div>
        </div>
      </div>
      <template slot="topLeft">
        <SearchAlarmById
          :init-value="searchedId"
          @search="isSearchingById = true"
          @searchById="searchById"
        />
      </template>
      <div slot="before-filters">
        <IndicatorsBlock @apply="indicatorClick" />
      </div>
      <div slot="before-table">
        <AlarmsPerDayGraph :partners="selectedPartnerIds" />
      </div>
      <template slot="actions" slot-scope="{ row }">
        <AlarmsActions :alarm="row" @actionIsDone="refreshAlarms()" />
      </template>
    </TableWithFilter>
  </div>
</template>

<script>
import TableWithFilter from '@/components/Filters/TableWithFilter';
import { col } from '@/components/DataTable/utils';
import UiButton from '@/components/ui/Button';

import AlarmNameCell from './cells/AlarmNameCell.vue';
import ThresholdCell from './cells/ThresholdCell.vue';
import TriggeredEventsCell from './cells/TriggeredEventsCell.vue';
import AlarmIdCell from './cells/AlarmIdCell.vue';
import AlarmStatusCell from './cells/AlarmStatusCell.vue';

import PartnerFilter from '@/components/Filters/filterbar/PartnerFilter';
import BillingAccountFilter from '@/components/Filters/filterbar/BillingAccountFilter';
import OffersFilter from '@/components/Filters/filterbar/OffersFilter';
import AlarmsRangeFilter from './filters/AlarmsRangeFilter';
import AlarmType from './filters/AlarmType';
import DateTriggerAlarm from './filters/DateTriggerAlarm';

import IndicatorsBlock from './IndicatorsBlock';
import AlarmsPerDayGraph from './AlarmsPerDayGraph';

import AlarmsActions from './cells/AlarmsActions';

import SearchAlarmById from './SearchAlarmById';
import { mapMutations } from 'vuex';

export default {
  components: {
    TableWithFilter,
    IndicatorsBlock,
    AlarmsPerDayGraph,
    AlarmsActions,
    SearchAlarmById,
    UiButton,
  },
  props: {
    m2m: Boolean,
    apiFn: Function,
  },
  data() {
    return {
      isSearchingById: false,
      searchedId: undefined,
      version: 0,
      defaultFilterValues: undefined,
      currentFilters: undefined,
      lastOrderBy: undefined,
      lastPagination: undefined,
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      total: 0,
      rows: [],
      isLoading: false,
      filters: undefined,
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
    };
  },

  computed: {
    selectedPartnerIds() {
      return this.currentPartners.map(p => p.id);
    },
    currentPartners() {
      if (!this.currentFilters) return [];

      const foundFilter = this.currentFilters.find(f => f.id === 'filters.partners');
      if (foundFilter && foundFilter.values && foundFilter.values.length) {
        return foundFilter.values;
      }

      return [];
    },
  },
  mounted() {
    this.prepareFilterBar();
    this.applyFilters();
  },
  methods: {
    ...mapMutations(['openPanel']),

    createAlarm() {
      const doReset = () => {
        this.page = 1;
        this.refreshAlarms();
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

    prepareFilterBar() {
      const filters = [
        {
          title: 'filters.partners',
          component: PartnerFilter,
          onChange(chosenValues) {
            return {
              id: 'filters.partners',
              values: chosenValues,
            };
          },
        },
        {
          title: 'common.billingAccount',
          component: BillingAccountFilter,
          getPageContext: () => {
            return { partners: this.currentPartners };
          },
          onChange(chosenValues) {
            return {
              id: 'common.billingAccount',
              values: chosenValues,
              data: chosenValues,
            };
          },
        },
        {
          title: 'filters.offers',
          component: OffersFilter,
          getPageContext: () => {
            return { partners: this.currentPartners };
          },
          onChange(chosenValues) {
            return {
              id: 'filters.offers',
              values: chosenValues,
              data: chosenValues,
            };
          },
        },
      ];

      if (!this.m2m) {
        filters.push(
          {
            title: 'getvsion.filters.ALARMS_OFFER',
            component: AlarmsRangeFilter,
            onChange(chosenValues) {
              return {
                id: 'getvsion.filters.ALARMS_OFFER',
                values: chosenValues,
                data: chosenValues,
              };
            },
          },
          {
            title: 'getvsion.filters.ALARM_TYPE',
            component: AlarmType,
            onChange(chosenValue) {
              return {
                id: 'getvsion.filters.ALARM_TYPE',
                value: chosenValue.value,
                data: chosenValue,
              };
            },
          }
        );
      }

      filters.push({
        title: 'getvsion.filters.DATE_TRIGGER',
        component: DateTriggerAlarm,
        onChange(chosenValue) {
          return {
            id: 'getvsion.filters.DATE_TRIGGER',
            startDate: chosenValue.startDate,
            endDate: chosenValue.endDate,
            data: chosenValue,
          };
        },
      });

      this.filters = filters;
    },

    async searchById(value) {
      if (!value) {
        await this.resetFilters();
      }
      this.searchedId = value;
      this.applyFilters({
        pagination: { page: 0, limit: 1 },
        filters: [
          {
            id: 'filters.alarmId',
            value,
          },
        ],
      });
    },
    async resetFilters() {
      this.defaultFilterValues = undefined;
      this.version += 1;
      await this.applyFilters();
    },
    async refreshAlarms() {
      this.isLoading = true;
      const data = await this.apiFn(this.lastOrderBy, this.lastPagination, this.currentFilters);
      this.isLoading = false;

      this.total = data.total;
      this.rows = data.items;
    },
    async indicatorClick(filters) {
      this.defaultFilterValues = filters;
      this.version += 1;
    },
    async applyFilters(payload) {
      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 10 },
        filters: [],
      };

      this.lastOrderBy = this.orderBy;
      this.lastPagination = pagination;

      this.isLoading = true;
      const data = await this.apiFn(this.orderBy, pagination, filters);
      this.isLoading = false;

      this.total = data.total;
      this.rows = data.items;
    },
  },
};
</script>

<style lang="scss" scoped>
.create-alarm-btn button {
  padding-left: 2rem;
  padding-right: 2rem;
  margin-top: 1rem;
}
</style>
