<template>
  <!-- <ConsumptionTable :columns.sync="columns" :fetch-data-fn="getFetchDataFn()" /> -->
  <PaginatedDataTable
    :key="tableVersion"
    :columns="columns"
    :fetch-data-fn="getFetchDataFn()"
    :size="7"
  />
</template>

<script>
import { dataUsage } from '@/api/consumption';
import { col } from '@/components/DataTable/utils';
import DataCol from './DataCol';
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable';

export default {
  props: {
    simcard: Object,
  },
  components: {
    PaginatedDataTable,
  },
  methods: {
    getFetchDataFn() {
      return async pageInfo => {
        const response = await dataUsage(this.simcard.id, pageInfo);
        const rows = response.items.map(r => {
          return { ...r, simcard: this.simcard };
        });
        const total = response.total;
        return { rows, total };
      };
    },
  },
  data() {
    return {
      tableVersion: 0,
      showExtraCells: false,
      orderBy: {
        key: 'date',
        direction: 'DESC',
      },
      columns: [
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.start'),
          'pdpConnectionDateInfo',
          true,
          true,
          {
            type: 'ObjectAttribute',
            path: 'startDate',
          }
        ),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.end'),
          'pdpConnectionDateInfo',
          true,
          true,
          {
            type: 'ObjectAttribute',
            path: 'endDate',
          }
        ),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.status'),
          'pdpConnectionHistory',
          true,
          true,
          {
            type: 'LabelCell',
            getValue: row => {
              return row.pdpConnectionHistory.connectionStatus;
            },
          }
        ),
        col(
          this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.closing'
          ),
          'pdpConnectionDateInfo',
          true,
          true,
          {
            type: 'LabelCell',
            getValue: row => {
              return row.pdpConnectionDateInfo.connectionClosingReason;
            },
          }
        ),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.data'),
          'data',
          true,
          true,
          { component: DataCol }
        ),
        col(
          this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.location'
          ),
          'location',
          true,
          true,
          {
            type: 'ObjectAttribute',
            path: 'detail',
          }
        ),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.apn'),
          'pdpConnectionHistory',
          true,
          true,
          {
            type: 'ObjectAttribute',
            path: 'apn',
          }
        ),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.ip'),
          'pdpConnectionHistory',
          true,
          true,
          {
            type: 'ObjectAttribute',
            path: 'ipAddressType',
          }
        ),
        col('IMEI', 'pdpConnectionHistory', false, false, {
          type: 'ObjectAttribute',
          path: 'imei',
        }),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.offer'),
          'pdpConnectionHistory',
          true,
          true,
          {
            type: 'ObjectAttribute',
            path: 'offerCode',
          }
        ),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.cellId'),
          'location',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'cellId',
          }
        ),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.device'),
          'device',
          false,
          false
        ),
        col(
          this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.manufacturer'
          ),
          'manufacturer',
          false,
          false
        ),
      ],
      rows: [],
      page: 1,
      pageLimit: 20,
      total: 0,
    };
  },
};
</script>

<style lang="scss" scoped></style>
