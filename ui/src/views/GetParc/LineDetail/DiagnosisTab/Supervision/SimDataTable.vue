<template>
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
import get from 'lodash.get';
import StatusCell from './StatusCell';

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

        if (rows.length) {
          if (!this.haveContent) {
            this.haveContent = true;
            this.$emit('haveContent', true);
          }
        }

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
            component: StatusCell,
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
            type: 'Getter',
            getter: row => {
              const closing = get(row, 'pdpConnectionDateInfo.connectionClosingReason');
              if (closing === 'N') {
                return this.$t(
                  'getparc.lineDetail.tab2.lineAnalysisContent.connectionClosingReason.N'
                );
              } else if (closing === 'A') {
                return this.$t(
                  'getparc.lineDetail.tab2.lineAnalysisContent.connectionClosingReason.A'
                );
              } else {
                return '';
              }
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
          false,
          true,
          {
            type: 'Getter',
            getter: row => {
              const ipAddressType = get(row, 'pdpConnectionHistory.ipAddressType');
              if (ipAddressType === null) {
                return this.$t('notAvailable');
              } else if (ipAddressType === 1) {
                return 'ipv4';
              } else if (ipAddressType === 2) {
                return 'ipv6';
              } else if (ipAddressType === 3) {
                return 'ipv4/ipv6';
              } else {
                return this.$t('notDefined');
              }
            },
          }
        ),
        col('IMEI', 'pdpConnectionHistory', false, false, {
          type: 'ObjectAttribute',
          path: 'imei',
        }),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.offer'),
          'pdpConnectionHistory',
          false,
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
        // col(
        //   this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.device'),
        //   'device',
        //   false,
        //   false
        // ),
        // col(
        //   this.$t(
        //     'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.manufacturer'
        //   ),
        //   'manufacturer',
        //   false,
        //   false
        // ),
      ],
      rows: [],
      page: 1,
      pageLimit: 20,
      total: 0,
      haveContent: false,
    };
  },
};
</script>

<style lang="scss" scoped></style>
