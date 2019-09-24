<template>
  <ConsumptionTable :columns.sync="columns" :fetch-data-fn="getFetchDataFn()" />
</template>

<script>
import ConsumptionTable from './ConsumptionTable';
import { dataUsage } from '@/api/consumption';

export default {
  props: {
    simcard: Object,
  },
  components: {
    ConsumptionTable,
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
      showExtraCells: false,
      orderBy: {
        key: 'date',
        direction: 'DESC',
      },
      columns: [
        {
          id: 1,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.start'
          ),
          name: 'startDate',
          orderable: true,
          visible: true,
        },
        {
          id: 2,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.end'
          ),
          name: 'endDate',
          orderable: true,
          visible: true,
        },
        {
          id: 3,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.status'
          ),
          name: 'connectionStatus',
          orderable: true,
          visible: true,
        },
        {
          id: 4,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.closing'
          ),
          name: 'connectionClosingReason',
          orderable: true,
          visible: true,
        },
        {
          id: 6,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.data'
          ),
          name: 'data',
          orderable: true,
          visible: true,
        },
        {
          id: 7,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.location'
          ),
          name: 'location',
          orderable: true,
          visible: true,
        },
        {
          id: 8,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.apn'
          ),
          name: 'apn',
          orderable: true,
          visible: true,
        },
        {
          id: 10,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.ip'
          ),
          name: 'ip',
          orderable: true,
          visible: false,
        },
        {
          id: 11,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.country'
          ),
          name: 'country',
          orderable: true,
          visible: false,
        },
        {
          id: 12,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.operator'
          ),
          name: 'operator',
          orderable: true,
          visible: false,
        },
        {
          id: 13,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.plmn'
          ),
          name: 'plmn',
          orderable: true,
          visible: false,
        },
        {
          id: 14,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.zipcode'
          ),
          name: 'zipcode',
          orderable: true,
          visible: false,
        },
        {
          id: 15,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.city'
          ),
          name: 'city',
          orderable: true,
          visible: false,
        },
        {
          id: 16,
          label: 'IMEI',
          name: 'imei',
          orderable: true,
          visible: false,
        },
        {
          id: 17,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.offer'
          ),
          name: 'offer',
          orderable: true,
          visible: false,
        },
        {
          id: 18,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.cellId'
          ),
          name: 'cellId',
          orderable: true,
          visible: false,
        },
        {
          id: 19,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.device'
          ),
          name: 'device',
          orderable: true,
          visible: false,
        },
        {
          id: 20,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.manufacturer'
          ),
          name: 'manufacturer',
          orderable: true,
          visible: false,
        },
        {
          id: 21,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.longitude'
          ),
          name: 'longitude',
          orderable: true,
          visible: false,
        },
        {
          id: 22,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.latitude'
          ),
          name: 'latitude',
          orderable: true,
          visible: false,
        },
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
