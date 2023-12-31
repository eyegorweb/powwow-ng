<template>
  <div>
    <TableWithFilter
      v-if="canShowTable"
      :filters="filters"
      :columns="columns"
      :rows="rows"
      :total="total"
      :size="0"
      :order-by.sync="orderBy"
      :is-loading="isLoading"
      @applyFilters="applyFilters"
      @colEvent="onColEvent"
    >
      <div slot="title">{{ $t('getparc.actLines.total', { total: formattedTotal }) }}</div>

      <div slot="topRight">
        <ExportButton :export-fn="getExportFn()" :columns="columns" :order-by="orderBy">
          <span slot="title">
            {{ $t('getparc.history.details.EXPORT_LINES', { total: formattedTotal }) }}
          </span>
        </ExportButton>
      </div>

      <div slot="topLeft">
        <SearchByLinesId @searchById="searchById" :init-value="searchByIdValue" />
      </div>

      <div v-if="total > 0" slot="after">
        <ReactivateForLinesAction
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

import ExportButton from '@/components/ExportButton';
import ReactivateForLinesAction from './ReactivateForLinesAction';

import BillingAccountFilter from '@/components/Filters/filterbar/BillingAccountFilter';
import OffersFilter from '@/components/Filters/filterbar/OffersFilter';

import CheckBoxCell from '../TargetedLinesByAlarmTab/CheckBoxCell';
import AssociatedAlarmsCell from '../TargetedLinesByAlarmTab/AssociatedAlarmsCell';

import { fetchLinesBoundToAlarm, exportlinesBoundTable } from '@/api/alarmDetails';
import get from 'lodash.get';
import { formatLargeNumber } from '@/utils/numbers';

import { mapMutations } from 'vuex';
import AlarmsFileFilter from '@/views/GetVision/alarmDetail/filters/AlarmsFileFilter.vue';

export default {
  components: {
    TableWithFilter,
    ExportButton,
    SearchByLinesId,
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
      canShowTable: true,
      filters: [
        {
          title: 'common.billingAccount',
          component: BillingAccountFilter,
          getPageContext: () => {
            const partnerId = get(this.alarm, 'party.id');
            if (!partnerId) return;
            return { partners: [{ id: partnerId }] };
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
          onChange(chosenValues) {
            return {
              id: 'filters.offers',
              values: chosenValues,
              data: chosenValues,
            };
          },
          getPageContext: () => {
            const partnerId = get(this.alarm, 'party.id');
            if (!partnerId) return;
            return { partnerId };
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
            getter: (row) => {
              if (get(row, 'party.partyType') === 'MULTI_CUSTOMER') {
                return get(row, 'accessPoint.offerGroup.description');
              }
              return get(row, 'accessPoint.offer.marketingOffer.description');
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
            getter: (row) => {
              const code = get(row, 'accessPoint.offerGroup.customerAccount.code');
              const name = get(row, 'accessPoint.offerGroup.customerAccount.name');
              return `${code} ${name}`;
            },
          },
        },
        {
          id: 5,
          label: this.$t('getvsion.associated_alarms'),
          orderable: true,
          visible: true,
          name: 'associated_alarms',
          noHandle: true,
          fixed: true,
          format: {
            component: AssociatedAlarmsCell,
          },
        },
      ],

      searchByIdValue: undefined,
      lastSearchByIdFilter: undefined,
      lastUsedFilters: [],

      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      pageInfo: {
        page: 0,
        limit: 20,
      },

      total: 10,
      rows: [],
      selectedRows: [],
    };
  },

  computed: {
    formattedTotal() {
      return formatLargeNumber(this.total);
    },
  },

  methods: {
    ...mapMutations(['flashMessage']),

    onSuccess() {
      this.canShowTable = false;
      this.searchByIdValue = undefined;
      this.lastUsedFilters = [];
      setTimeout(() => {
        this.canShowTable = true;

        this.applyFilters();
      });
    },

    onColEvent(payload) {
      if (payload.add) {
        this.selectedRows.push(payload.add);
      }
      if (payload.remove) {
        this.selectedRows = this.selectedRows.filter((r) => r.id !== payload.remove.id);
      }
    },

    saveLastUsedFilter(filter) {
      let lastUsedFilters = undefined;
      if (this.lastUsedFilters) {
        lastUsedFilters = [...this.lastUsedFilters];
      }

      if (lastUsedFilters && lastUsedFilters.length) {
        const found = lastUsedFilters.find((f) => f.id === filter.id);
        if (found) {
          lastUsedFilters = lastUsedFilters.filter((f) => f.id !== filter.id);
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

    getExportFn() {
      return async (columnsParam, orderBy, exportFormat, asyncExportRequest) => {
        return await exportlinesBoundTable(
          ['ICCID', 'LINKED_ALARM', 'OFFER', 'CUSTOMER_ACCOUNT', 'CUSTOMER_ACCOUNT_NAME'],
          this.orderBy,
          this.alarm.id,
          exportFormat,
          'ne',
          asyncExportRequest,
          this.lastUsedFilters
        );
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

      if (params && params.value && params.value.length) {
        this.searchByIdValue = params.value;
        this.lastSearchByIdFilter = params;
        // this.lastUsedFilters = [params];
        this.saveLastUsedFilter(params);
      } else {
        this.lastSearchByIdFilter = undefined;
        this.searchByIdValue = undefined;
        this.saveLastUsedFilter({
          id: params.id, // passer juste l'id pour supprimer le filtre
        });
      }

      this.isLoading = true;

      const data = await fetchLinesBoundToAlarm(this.orderBy, this.pageInfo, [
        ...mandatoryFilters,
        params,
      ]);

      this.isLoading = false;

      this.total = data.total;
      this.rows = data.items;
    },

    async applyFilters(payload) {
      const { pagination, filters } = payload || {
        pagination: this.pageInfo,
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
