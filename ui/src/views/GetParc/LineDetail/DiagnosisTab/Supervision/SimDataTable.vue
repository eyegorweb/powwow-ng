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
import LocationCell from './LocationCell';
import OfferCell from './OfferCell';

export default {
  name: 'SimDataTable',
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
          false,
          {
            type: 'ObjectAttribute',
            path: 'startDate',
          }
        ),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.end'),
          'pdpConnectionDateInfo',
          true,
          false,
          {
            type: 'ObjectAttribute',
            path: 'endDate',
          }
        ),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.status'),
          'pdpConnectionHistory',
          true,
          false,
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
          false,
          {
            type: 'Getter',
            getter: row => {
              const closing = get(row, 'pdpConnectionDateInfo.connectionClosingReasonTranslated');
              if (closing === 'NORMALE') {
                return this.$t(
                  'getparc.lineDetail.tab2.lineAnalysisContent.connectionClosingReason.N'
                );
              } else if (closing === 'AUTRE') {
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
          false,
          { component: DataCol }
        ),
        col(
          this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.location'
          ),
          'location',
          true,
          false,
          {
            component: LocationCell,
          }
        ),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.apn'),
          'pdpConnectionHistory',
          true,
          false,
          {
            type: 'ObjectAttribute',
            path: 'apn',
          }
        ),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.ip'),
          'pdpConnectionHistory',
          false,
          false,
          {
            type: 'Getter',
            getter: row => {
              return get(row, 'ipAddressTypeTranslated');
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
          false,
          {
            component: OfferCell,
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
