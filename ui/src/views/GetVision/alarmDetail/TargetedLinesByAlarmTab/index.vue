<template>
  <div>
    <TableWithFilter
      v-if="canShowTable"
      :filters="filters"
      :columns="columns"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :size="0"
      :is-loading="isLoading"
      @applyFilters="applyFilters"
      @colEvent="onColEvent"
    >
      <div slot="title">{{ $t('getparc.actLines.total', { total: formattedTotal }) }}</div>

      <div slot="topRight">
        <ExportButton :export-fn="getExportFn()" :columns="columns" :order-by="orderBy">
          <span slot="title">{{
            $t('getparc.history.details.EXPORT_LINES', { total: formattedTotal })
          }}</span>
        </ExportButton>
      </div>

      <div slot="topLeft">
        <SearchByLinesId @searchById="searchById" :init-value="searchByIdValue" />
      </div>

      <div slot="actions">
        <Actions />
      </div>

      <div v-if="total > 0" slot="after">
        <DisableForLinesAction
          :alarm="alarm"
          :rows="selectedRows"
          :filters="lastUsedFilters"
          :total="total"
          @success="onSuccess"
        />
      </div>
    </TableWithFilter>
  </div>
</template>

<script>
import TableWithFilter from '@/components/Filters/TableWithFilter';
import SearchByLinesId from '@/components/SearchById';

import TriggerReasonFilter from '../filters/TriggerReasonFilter';
import TriggerDateFilter from '../filters/TriggerDateFilter';
import Actions from './Actions';
import DisableForLinesAction from './DisableForLinesAction';
import LastTriggerCell from './LastTriggerCell';
import AssociatedAlarmsCell from './AssociatedAlarmsCell';
import CheckBoxCell from './CheckBoxCell';

import ExportButton from '@/components/ExportButton';
import ICCIDCell from '../TriggerMonthTab/ICCIDCell';
import AlarmsFileFilter from '@/views/GetVision/alarmDetail/filters/AlarmsFileFilter.vue';

import { mapMutations } from 'vuex';

import { fetchLinesBoundToAlarm, exportlinesBoundTable } from '@/api/alarmDetails';
import { formatLargeNumber } from '@/utils/numbers';

export default {
  components: {
    TableWithFilter,
    ExportButton,
    SearchByLinesId,
    Actions,
    DisableForLinesAction,
  },
  props: {
    alarm: Object,
  },

  mounted() {
    this.applyFilters();
  },

  computed: {
    formattedTotal() {
      return formatLargeNumber(this.total);
    },
  },

  methods: {
    ...mapMutations(['openPanel']),
    openDetailPanel(payload) {
      if (payload.action !== 'openAlarmPanel') return;
      const title = 'getparc.lineDetail.alarms.trigger-history';
      const openTrigger = () => {
        this.openPanel({
          title: this.$t(title),
          panelId: title,
          wide: false,
          backdrop: false,
          payload: {
            alarm: this.alarm,
            sim: payload.row,
          },
        });
      };

      /**
       * On veux attendre que le panel existant soit fermé avant de réouvrir un nouveau panel
       */
      if (this.isOpen) {
        setTimeout(openTrigger, 500);
      } else {
        openTrigger();
      }
    },

    getExportFn() {
      return async (columnsParam, orderBy, exportFormat, asyncExportRequest) => {
        return await exportlinesBoundTable(
          ['ICCID', 'ACTIVATION_DATE', 'LAST_TRIGGERED', 'LINKED_ALARM'],
          this.orderBy,
          this.alarm.id,
          exportFormat,
          'eq',
          asyncExportRequest
        );
      };
    },

    async searchById(params) {
      const mandatoryFilters = [
        {
          id: 'filters.alarmId',
          value: this.alarm.id,
        },
      ];

      if (params && params.value && params.value.length) {
        this.searchByIdValue = params.value;
        this.lastSearchByIdFilter = params;
        this.saveLastUsedFilter(params);
      } else {
        this.lastSearchByIdFilter = undefined;
        this.searchByIdValue = undefined;
        this.saveLastUsedFilter({
          id: params.id // passer juste l'id pour supprimer le filtre
        });
      }


      this.isLoading = true;
      const data = await fetchLinesBoundToAlarm(this.orderBy, { page: 0, limit: 10 }, [
        ...mandatoryFilters,
        params,
      ]);
      this.isLoading = false;

      this.total = data.total;
      this.rows = data.items;
    },

    onColEvent(payload) {
      if (payload.add) {
        this.selectedRows.push(payload.add);
      }
      if (payload.remove) {
        this.selectedRows = this.selectedRows.filter((r) => r.id !== payload.remove.id);
      }

      if (payload.action === 'openAlarmPanel') {
        this.openDetailPanel(payload);
      }
    },

    onSuccess() {
      this.canShowTable = false;
      this.searchByIdValue = undefined;
      this.lastUsedFilters = [];
      setTimeout(() => {
        this.canShowTable = true;

        this.applyFilters();

      });
    },

    saveLastUsedFilter(filter) {
      let lastUsedFilters = undefined;
      if (this.lastUsedFilters) {
        lastUsedFilters = [...this.lastUsedFilters];
      }

      if (lastUsedFilters && lastUsedFilters.length) {
        const found = lastUsedFilters.find(f => f.id === filter.id);
        if (found) {
          lastUsedFilters = lastUsedFilters.filter(f => f.id !== filter.id);
        }
        if (filter && filter.value) {
          lastUsedFilters.push(found);
        }
      } else {
        if (filter && filter.value) {
          lastUsedFilters = [filter];
        }
      }

      this.lastUsedFilters = lastUsedFilters;
    },


    async applyFilters(payload) {
      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 10 },
        filters: [],
      };

      const mandatoryFilters = [
        {
          id: 'filters.alarmId',
          value: this.alarm.id,
        },
      ];

      this.lastUsedFilters = filters;

      this.isLoading = true;

      const data = await fetchLinesBoundToAlarm(this.orderBy, pagination, [
        ...filters,
        ...mandatoryFilters,
      ]);

      this.isLoading = false;

      this.total = data.total;
      this.rows = data.items;
    },
  },

  data() {
    return {
      canShowTable: true,
      lastSearchByIdFilter: undefined,
      selectedRows: [],
      filters: [
        {
          title: 'getvsion.alarm.trigger_reason',
          component: TriggerReasonFilter,
          onChange(chosenValue) {
            return {
              id: 'getvsion.alarm.trigger_reason',
              value: chosenValue.label,
              data: chosenValue,
            };
          },
        },
        {
          title: 'getvsion.alarm.trigger_date',
          component: TriggerDateFilter,
          onChange(chosenValue) {
            return {
              id: 'getvsion.alarm.trigger_date',
              startDate: chosenValue.startDate,
              endDate: chosenValue.endDate,
              data: chosenValue,
            };
          },
        },

        {
          title: 'filters.lines.fromFile.title',
          component: AlarmsFileFilter,
          onChange(fileResponse) {
            return {
              id: 'filters.lines.fromFile.title',
              values: [
                {
                  id: fileResponse.uploadId,
                  label: fileResponse.file.name,
                  ...fileResponse,
                },
              ],
            };
          },
        },
      ],
      columns: [
        {
          id: 99,
          label: '',
          name: 'partner',
          orderable: false,
          visible: true,
          noHandle: true,
          notConfigurable: true,
          format: {
            component: CheckBoxCell,
          },
        },
        {
          id: 2,
          label: this.$t('getparc.actDetail.col.iccid'),
          orderable: true,
          visible: true,
          name: 'iccid',
          noHandle: true,
          fixed: true,
          format: {
            component: ICCIDCell,
          },
        },
        {
          id: 3,
          label: this.$t('getvsion.activation_date'),
          orderable: true,
          visible: true,
          name: 'activationDate',
          noHandle: true,
          fixed: true,
        },
        {
          id: 4,
          label: this.$t('getvsion.last_triggered'),
          orderable: true,
          visible: true,
          name: 'activationDate',
          noHandle: true,
          fixed: true,
          format: {
            component: LastTriggerCell,
          },
        },
        {
          id: 5,
          label: this.$t('getvsion.associated_alarms'),
          orderable: true,
          visible: true,
          name: 'linked_alarms',
          noHandle: true,
          fixed: true,
          format: {
            component: AssociatedAlarmsCell,
          },
        },
      ],

      searchByIdValue: undefined,
      lastUsedFilters: [],

      orderBy: {
        key: 'id',
        direction: 'DESC',
      },

      total: 10,
      rows: [],
      isLoading: false,
    };
  },
};
</script>

<style lang="scss" scoped></style>
