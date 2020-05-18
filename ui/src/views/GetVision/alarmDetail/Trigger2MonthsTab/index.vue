<template>
  <div>
    <TableWithFilter
      :filters="filters"
      :columns="columns"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :size="0"
      :is-loading="isLoading"
      @applyFilters="applyFilters"
      @colEvent="openDetailPanel"
    >
      <div slot="title">{{ $t('getparc.actLines.total', { total: total }) }}</div>

      <div slot="topRight">
        <ExportButton :export-fn="getExportFn()" :columns="columns" :order-by="orderBy">
          <span slot="title">{{
            $t('getparc.history.details.EXPORT_LINES', { total: total })
          }}</span>
        </ExportButton>
      </div>

      <div slot="topLeft">
        <SearchByLinesId @searchById="searchById" :init-value="searchByIdValue" />
      </div>

      <div slot="actions">
        <Actions />
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
import ThisMonthTriggerCell from './ThisMonthTriggerCell';
import LastMonthTriggerCell from './LastMonthTriggerCell';
import ICCIDCell from './ICCIDCell';

import ExportButton from '@/components/ExportButton';

import { fetchAlarmTriggersFor2Months } from '@/api/alarmDetails';
import { mapMutations } from 'vuex';

export default {
  components: {
    TableWithFilter,
    ExportButton,
    SearchByLinesId,
    Actions,
  },
  props: {
    alarm: Object,
  },

  mounted() {
    this.applyFilters();
  },

  methods: {
    ...mapMutations(['openPanel']),

    getExportFn() {
      return async (columns, orderBy, exportFormat) => {
        console.log(columns, orderBy, exportFormat);
        return { errors: 'mock' };
      };
    },

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

    async searchById(params) {
      const mandatoryFilters = [
        {
          id: 'filters.alarmId',
          value: this.alarm.id,
        },
      ];

      this.searchByIdValue = params.value;

      this.isLoading = true;

      const data = await fetchAlarmTriggersFor2Months(this.orderBy, { page: 0, limit: 10 }, [
        ...mandatoryFilters,
        params,
      ]);

      this.isLoading = false;

      this.total = data.total;
      this.rows = data.items;
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
      const data = await fetchAlarmTriggersFor2Months(this.orderBy, pagination, [
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
      isLoading: false,
      searchByIdValue: undefined,
      lastUsedFilters: [],
      columns: [
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
          label: this.$t('getvsion.triggered_this_month'),
          orderable: true,
          visible: true,
          name: 'activationDate',
          noHandle: true,
          fixed: true,
          format: {
            component: ThisMonthTriggerCell,
          },
        },
        {
          id: 5,
          label: this.$t('getvsion.last_month_triggered'),
          orderable: true,
          visible: true,
          name: 'activationDate',
          noHandle: true,
          fixed: true,
          format: {
            component: LastMonthTriggerCell,
          },
        },
      ],
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },

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
      ],

      total: 10,
      rows: [],
    };
  },
};
</script>

<style lang="scss" scoped></style>
