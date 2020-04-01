<template>
  <div>
    <TableWithFilter
      :filters="filters"
      :columns="columns"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :is-loading="isLoading"
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

      <div v-if="total > 0" slot="after">
        <ReactivateForLinesAction
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
import SearchByLinesId from '@/components/SearchById';

import ExportButton from '@/components/ExportButton';
import Actions from './Actions';
import ReactivateForLinesAction from './ReactivateForLinesAction';

import BillingAccountFilter from './BillingAccountFilter';
import OffersFilter from './OffersFilter';

import CheckBoxCell from '../TargetedLinesByAlarmTab/CheckBoxCell';
import AssociatedAlarmsCell from '../TargetedLinesByAlarmTab/AssociatedAlarmsCell';

import { fetchLinesBoundToAlarm } from '@/api/alarmDetails';
import get from 'lodash.get';

import { mapMutations } from 'vuex';

export default {
  components: {
    TableWithFilter,
    ExportButton,
    SearchByLinesId,
    Actions,
    ReactivateForLinesAction,
  },
  props: {
    alarm: Object,
  },

  mounted() {
    this.applyFilters();
  },

  data() {
    return {
      isLoading: false,
      filters: [
        {
          title: 'common.billingAccount',
          component: BillingAccountFilter,
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
          onChange(chosenValues) {
            return {
              id: 'filters.offers',
              values: chosenValues,
              data: chosenValues,
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
          label: this.$t('col.offer'),
          orderable: true,
          visible: true,
          name: 'offer',
          noHandle: true,
          fixed: true,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'alarmInstance.accessPoint.offer.marketingOffer.description');
            },
          },
        },
        {
          id: 4,
          label: this.$t('common.billingAccount'),
          orderable: true,
          visible: true,
          name: 'billingAccount',
          noHandle: true,
          fixed: true,
          format: {
            type: 'Getter',
            getter: row => {
              const code = get(row, 'alarmInstance.accessPoint.offerGroup.customerAccount.code');
              const name = get(row, 'alarmInstance.accessPoint.offerGroup.customerAccount.name');
              return `${code} ${name}`;
            },
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

  methods: {
    ...mapMutations(['flashMessage']),

    getExportFn() {
      return async (columns, orderBy, exportFormat) => {
        console.log(columns, orderBy, exportFormat);
        return { errors: 'mock' };
      };
    },

    async searchById(params) {
      const mandatoryFilters = [
        {
          id: 'filters.alarmId',
          value: this.alarm.id,
          notEqual: true,
        },
      ];

      this.searchByIdValue = params.value;

      this.isLoading = true;

      const data = await fetchLinesBoundToAlarm(this.orderBy, { page: 0, limit: 10 }, [
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
          notEqual: true,
        },
      ];

      this.lastUsedFilters = filters;

      this.isLoading = true;

      const data = await fetchLinesBoundToAlarm(this.orderBy, pagination, [
        ...filters,
        ...mandatoryFilters,
      ]);

      this.isLoading = false;

      if (data.errors && data.errors.length) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
        this.total = 0;
        this.rows = [];
        return;
      }

      this.total = data.total;
      this.rows = data.items;
    },
  },
};
</script>

<style lang="scss" scoped></style>
