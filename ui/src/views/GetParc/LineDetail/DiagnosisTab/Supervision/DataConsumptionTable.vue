<template>
  <DataTable
    :columns.sync="columns"
    :rows="pdpConnexionData || []"
    :page.sync="page"
    :page-limit.sync="pageLimit"
    :order-by.sync="orderBy"
    :show-extra-columns.sync="showExtraCells"
    :size="7"
  >
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import { fetchCurrentPdpConnexion } from '@/api/pdpConnexion';
import get from 'lodash.get';

export default {
  data() {
    return {
      pdpConnexionData: undefined,
      page: 0,
      pageLimit: 20,
      orderBy: {
        key: 'startDate',
        direction: 'DESC',
      },
      showExtraCells: false,
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
          label: this.$t('Data (Mo)'),
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
    };
  },
  components: {
    DataTable,
  },
  async mounted() {
    if (this.getValue(this.content, 'id') && this.isLigneActive) {
      this.pdpConnexionData = await fetchCurrentPdpConnexion(this.getValue(this.content, 'id'));
    }
  },
  methods: {
    getValue(objectToUse, path, defaultValue = '') {
      if (objectToUse == null || objectToUse == undefined) {
        return '-';
      }
      const value = get(objectToUse, path, defaultValue);

      return value !== null ? value : '-';
    },
  },
};
</script>

<style lang="scss" scoped></style>
