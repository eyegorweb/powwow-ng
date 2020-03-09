<template>
  <div>
    <TableWithFilter
      :filters="filters"
      :columns="columns"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :size="0"
      @applyFilters="applyFilters"
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
import SearchByLinesId from '@/views/GetParc/ActLines/SearchByLinesId';

import TriggerReasonFilter from '../filters/TriggerReasonFilter';
import TriggerDateFilter from '../filters/TriggerDateFilter';
import Actions from './Actions';
import ThisMonthTriggerCell from './ThisMonthTriggerCell';
import LastMonthTriggerCell from './LastMonthTriggerCell';

import ExportButton from '@/components/ExportButton';

import { fetchAlarmTriggersFor2Months } from '@/api/alarmDetails';

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
    getExportFn() {
      return async (columns, orderBy, exportFormat) => {
        console.log(columns, orderBy, exportFormat);
        return { errors: 'mock' };
      };
    },

    searchById(value) {
      console.log('search by id > ', value);
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
        {
          id: 'filters.partyId',
          value: this.alarm.party.id,
        },
      ];

      this.lastUsedFilters = filters;
      const data = await fetchAlarmTriggersFor2Months(this.orderBy, pagination, [
        ...filters,
        ...mandatoryFilters,
      ]);

      this.total = data.total;
      this.rows = data.items;
    },
  },

  data() {
    return {
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
