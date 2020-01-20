<template>
  <div>
    <TableWithFilter
      :filters="filters"
      :columns="columns"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      @applyFilters="applyFilters"
    >
      <div slot="title">{{ $t('getparc.actLines.total', { total: total }) }}</div>

      <div slot="topRight">
        <ExportButton :export-fn="getExportFn()" :columns="columns" :order-by="orderBy">
          <span slot="title">
            {{ $t('getparc.history.details.EXPORT_LINES', { total: total }) }}
          </span>
        </ExportButton>
      </div>

      <div slot="topLeft">
        <SearchByLinesId @searchById="searchById" :init-value="searchByIdValue" />
      </div>

      <div slot="actions">
        <Actions />
      </div>

      <div slot="after">
        <DisableForLinesAction
          :alarm="alarm"
          :rows="rows"
          :filters="lastUsedFilters"
          :total="total"
        />
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
import DisableForLinesAction from './DisableForLinesAction';

import ExportButton from '@/components/ExportButton';

import { fetchData } from '@/api/mockApi.js';

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

      this.lastUsedFilters = filters;
      const data = await fetchData(this.orderBy, pagination, filters);

      this.total = data.total;
      this.rows = data.data;
    },
  },

  data() {
    return {
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
      columns: [
        {
          id: 2,
          label: this.$t('col.id'),
          orderable: true,
          visible: true,
          name: 'name',
          exportId: 'ID',
          noHandle: true,
          fixed: true,
          format: {
            type: 'Getter',
            getter: row => {
              return row.name;
            },
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
    };
  },
};
</script>

<style lang="scss" scoped></style>
