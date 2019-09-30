<template>
  <!-- <ConsumptionTable :columns.sync="columns" :fetch-data-fn="getFetchDataFn()" /> -->
  <PaginatedDataTable
    :key="tableVersion"
    :columns="columns"
    :fetch-data-fn="getFetchDataFn()"
    :size="0"
  />
</template>

<script>
import { dataUsage } from '@/api/consumption';
import LabelCell from './LabelCell';
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
          return { ...r.dataHistory, simcard: this.simcard };
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
          'startDate',
          true,
          true
        ),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.end'),
          'endDate',
          true,
          true
        ),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.status'),
          'connectionStatus',
          true,
          true,
          {
            component: LabelCell,
          }
        ),
        col(
          this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.closing'
          ),
          'connectionClosingReason',
          true,
          true,
          {
            component: LabelCell,
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
          true
        ),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.apn'),
          'apn',
          true,
          true
        ),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.ip'),
          'ip',
          true,
          true
        ),
        col('IMEI', 'imei', false, false),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.offer'),
          'offer',
          false,
          false
        ),
        col(
          this.$t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.cellId'),
          'cellId',
          false,
          false
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

        // Put in location column
        // {
        //   id: 11,
        //   label: this.$t(
        //     'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.country'
        //   ),
        //   name: 'country',
        //   orderable: true,
        //   visible: false,
        // },
        // {
        //   id: 12,
        //   label: this.$t(
        //     'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.operator'
        //   ),
        //   name: 'operator',
        //   orderable: true,
        //   visible: false,
        // },
        // {
        //   id: 13,
        //   label: this.$t(
        //     'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.plmn'
        //   ),
        //   name: 'plmn',
        //   orderable: true,
        //   visible: false,
        // },
        // {
        //   id: 14,
        //   label: this.$t(
        //     'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.zipcode'
        //   ),
        //   name: 'zipcode',
        //   orderable: true,
        //   visible: false,
        // },
        // {
        //   id: 15,
        //   label: this.$t(
        //     'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.city'
        //   ),
        //   name: 'city',
        //   orderable: true,
        //   visible: false,
        // },

        // {
        //   id: 21,
        //   label: this.$t(
        //     'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.longitude'
        //   ),
        //   name: 'longitude',
        //   orderable: true,
        //   visible: false,
        // },
        // {
        //   id: 22,
        //   label: this.$t(
        //     'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.latitude'
        //   ),
        //   name: 'latitude',
        //   orderable: true,
        //   visible: false,
        // },
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
