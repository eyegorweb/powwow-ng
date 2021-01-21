<template>
  <div class="mt-4">
    <TableWithFilter
      :key="version"
      storage-version="009"
      storage-id="getVision.alarms"
      v-if="columns && filters"
      show-reset
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
      @resetSearch="resetFilters"
    >
      <div slot="title" class="mt-2 table-total" v-if="!searchError">
        {{ $t('getvsion.table.total', { total: formattedTotal }) }}
      </div>
      <div slot="title" class="mt-2 table-total" v-else>
        {{ $t('searchError') }}
      </div>
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
import { mapGetters, mapMutations } from 'vuex';
import { formatLargeNumber } from '@/utils/numbers';

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
      searchError: false,
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
        {
          id: 1,
          label: this.$t('col.id'),
          name: 'id',
          orderable: true,
          visible: true,
          fixed: true,
          noHandle: true,
          format: {
            component: AlarmIdCell,
          },
        },
        {
          id: 2,
          label: this.$t('getparc.lineDetail.alarms.name'),
          name: 'name',
          orderable: true,
          visible: true,
          format: {
            component: AlarmNameCell,
          },
        },
        {
          id: 3,
          label: this.$t('getvsion.table.thresholds'),
          name: 'thresholds',
          orderable: false,
          visible: true,
          format: {
            component: ThresholdCell,
          },
        },
        {
          id: 4,
          label: this.$t('getvsion.table.targetedLines'),
          name: 'numberOfTargetedLines',
          orderable: false,
          visible: true,
        },
        {
          id: 5,
          label: this.$t('filters.lines.activationDate'),
          name: 'startDate',
          orderable: true,
          visible: true,
        },
        {
          id: 6,
          label: this.$t('getvsion.table.triggers'),
          name: 'triggers',
          orderable: true,
          visible: false,
          format: {
            component: TriggeredEventsCell,
          },
        },
        {
          id: 8,
          label: this.$t('col.partner'),
          name: 'party',
          orderable: true,
          visible: false,
          format: {
            type: 'ObjectAttribute',
            path: 'name',
          },
        },
        {
          id: 9,
          label: this.$t('getvsion.table.alarmStatus'),
          name: 'name',
          orderable: true,
          visible: true,
          format: {
            component: AlarmStatusCell,
          },
        },
        {
          id: 10,
          label: this.$t('getparc.lineDetail.offer'),
          name: 'autoPositionWorkflow',
          orderable: true,
          visible: false,
          format: {
            type: 'ObjectAttribute',
            path: 'workflowDescription',
          },
        },
        {
          id: 11,
          label: this.$t('common.billingAccount'),
          name: 'autoPositionCustAccount',
          orderable: true,
          visible: false,
          format: {
            type: 'ObjectAttribute',
            path: 'name',
          },
        },
        {
          id: 12,
          label: this.$t('getparc.lineDetail.alarms.observationCycle'),
          orderable: true,
          visible: false,
          name: 'observationCycle',
          noHandle: false,
          format: {
            type: 'Getter',
            getter: row => {
              if (row.observationCycle === 'CUSTOM' || row.observationCycle === null) {
                if (
                  row.type === 'OVER_CONSUMPTION_VOLUME' ||
                  row.type === 'UNDER_CONSUMPTION_VOLUME'
                ) {
                  if (row.observationDelay !== null) {
                    return `${this.$t('alarms.observationCycles.CUSTOM')} : ${
                      row.observationDelay
                    } ${this.$t('alarms.observationCycles.DAYS')}`;
                  }
                  return `${this.$t('alarms.observationCycles.CUSTOM')}`;
                }
                return `${this.$t('notAvailableShortCut')}`;
              } else {
                if (
                  ['DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM', 'DAYS'].find(
                    o => o === row.observationCycle
                  )
                ) {
                  return this.$t('alarms.observationCycles.' + row.observationCycle);
                }
                return row.observationCycle;
              }
            },
          },
        },
        {
          id: 13,
          label: this.$t('getvsion.filters.ALARMS_OFFER'),
          orderable: true,
          visible: false,
          name: 'alarmScope',
          noHandle: false,
          format: {
            type: 'Getter',
            getter: row => {
              return row.alarmScope ? this.$t('alarms.alarmScope.' + row.alarmScope) : '-';
            },
          },
        },
      ],
    };
  },

  computed: {
    ...mapGetters(['userIsPartner']),
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
    formattedTotal() {
      return formatLargeNumber(this.total);
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
      const filters = [];

      if (!this.userIsPartner) {
        filters.push({
          title: 'filters.partners',
          component: PartnerFilter,
          onChange(chosenValues) {
            return {
              id: 'filters.partners',
              values: chosenValues,
            };
          },
        });
      }

      filters.push(
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
        }
      );

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
                data: chosenValue.code,
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
        return;
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
        searchingById: true,
      });
    },
    async resetFilters() {
      this.searchedId = undefined;
      this.defaultFilterValues = undefined;
      this.version += 1;
      await this.applyFilters();
    },
    async refreshAlarms() {
      this.isLoading = true;
      try {
        const data = await this.apiFn(this.lastOrderBy, this.lastPagination, this.currentFilters);
        this.searchError = false;
        this.isLoading = false;
        this.total = data.total;
        this.rows = data.items;
      } catch (error) {
        this.searchError = true;
        this.isLoading = false;
        this.total = undefined;
        this.rows = undefined;
      }
    },
    async indicatorClick(filters) {
      this.defaultFilterValues = filters;
      this.version += 1;
    },
    async applyFilters(payload) {
      const { pagination, filters, searchingById } = payload || {
        pagination: { page: 0, limit: 10 },
        filters: [],
      };

      if (searchingById) {
        this.lastOrderBy = this.orderBy;
        this.lastPagination = pagination;
      }

      this.isLoading = true;
      try {
        const data = await this.apiFn(this.orderBy, pagination, filters);
        this.searchError = false;
        this.isLoading = false;
        this.total = data.total;
        this.rows = data.items;
      } catch (error) {
        this.searchError = true;
        this.isLoading = false;
        this.total = undefined;
        this.rows = undefined;
      }
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
