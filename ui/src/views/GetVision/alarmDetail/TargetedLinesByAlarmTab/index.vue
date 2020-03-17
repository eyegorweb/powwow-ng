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
      @colEvent="onColEvent"
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
          :rows="selectedRows"
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
import LastTriggerCell from './LastTriggerCell';
import AssociatedAlarmsCell from './AssociatedAlarmsCell';
import CheckBoxCell from './CheckBoxCell';

import ExportButton from '@/components/ExportButton';

import { fetchLinesBoundToAlarm } from '@/api/alarmDetails';
import get from 'lodash.get';

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

    async searchById(value) {
      const mandatoryFilters = [
        {
          id: 'filters.alarmId',
          value: this.alarm.id,
        },
        /*
        {
          id: 'filters.partyId',
          value: this.alarm.party.id,
        },
        //*/
      ];

      const data = await fetchLinesBoundToAlarm(this.orderBy, { page: 0, limit: 10 }, [
        ...mandatoryFilters,
        value,
      ]);

      this.total = data.total;
      this.rows = data.items;
    },

    onColEvent(payload) {
      if (payload.add) {
        this.selectedRows.push(payload.add);
      }
      if (payload.remove) {
        this.selectedRows = this.selectedRows.filter(r => r.id !== payload.remove.id);
      }
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
        /*
        {
          id: 'filters.partyId',
          value: this.alarm.party.id,
        },//*/
      ];

      this.lastUsedFilters = filters;
      const data = await fetchLinesBoundToAlarm(this.orderBy, pagination, [
        ...filters,
        ...mandatoryFilters,
      ]);

      console.log('By ID >> ', data);

      this.total = data.total;
      this.rows = data.items;
    },
  },

  data() {
    return {
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
        },
        {
          id: 3,
          label: this.$t('getvsion.activation_date'),
          orderable: true,
          visible: true,
          name: 'activationDate',
          noHandle: true,
          fixed: true,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'alarmInstance.created');
            },
          },
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
          name: 'activationDate',
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
    };
  },
};
</script>

<style lang="scss" scoped></style>
