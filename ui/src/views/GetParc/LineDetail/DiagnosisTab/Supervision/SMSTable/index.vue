<template>
  <DataTable
    :columns.sync="columns"
    :rows="rows || []"
    :page.sync="page"
    :total="total || 0"
    :order-by.sync="orderBy"
    :page-limit.sync="pageLimit"
    :size="6"
    :show-extra-columns.sync="showExtraCells"
  />
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import { smsUsage } from '@/api/consumption';

export default {
  props: {
    simId: String,
  },
  components: {
    DataTable,
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
          label: this.$t('date'),
          name: 'recordOpeningTime',
          orderable: false,
          visible: true,
        },
        {
          id: 2,
          label: 'Entrant/Sortant',
          name: 'incoming', // composant à faire
          orderable: false,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('getparc.actDetail.col.msisdn'),
          name: 'callingNumber', // composant à faire
          orderable: false,
          visible: true,
        },
        {
          id: 4,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.location'
          ),
          name: 'localisation', // ??
          orderable: false,
          visible: true,
        },
        {
          id: 5,
          label: this.$t('filters.country'),
          name: 'countryISO3',
          orderable: false,
          visible: true,
        },
        {
          id: 6,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.operator'
          ),
          name: 'operator', // ??
          orderable: false,
          visible: true,
        },
        {
          id: 7,
          label: 'PLMN',
          name: 'plmn',
          orderable: false,
          visible: false,
        },
        {
          id: 8,
          label: this.$t('filters.postalCode'),
          name: 'postalCode', // ??
          orderable: false,
          visible: false,
        },
        {
          id: 9,
          label: this.$t('filters.city'),
          name: 'city', // ??
          orderable: false,
          visible: false,
        },
        {
          id: 10,
          label: this.$t('getparc.actDetail.col.imei'),
          name: 'imei', // ??
          orderable: false,
          visible: false,
        },
        {
          id: 11,
          label: this.$t('getparc.lineDetail.offer'),
          name: 'offerCode',
          orderable: false,
          visible: false,
        },
        {
          id: 12,
          label: this.$t('common.orderReference'),
          name: 'orderReference', // ??
          orderable: false,
          visible: false,
        },
        {
          id: 13,
          label: this.$t('getparc.actLines.col.manufacturer'),
          name: 'manufacturer', // ??
          orderable: false,
          visible: false,
        },
        {
          id: 13,
          label: 'Longitude',
          name: 'Longitude', // ??
          orderable: false,
          visible: false,
        },
        {
          id: 14,
          label: 'Latitude',
          name: 'Latitude', // ??
          orderable: false,
          visible: false,
        },
      ],
      rows: [],
      page: 1,
      pageLimit: 20,
      total: 0,
    };
  },
  mounted() {
    this.refreshTable();
  },
  computed: {
    pageInfo() {
      return { page: this.page - 1, limit: this.pageLimit };
    },
  },
  methods: {
    async refreshTable() {
      const response = await smsUsage(this.simId, this.pageInfo);
      this.rows = response.map(r => {
        return r.smsHistory;
      });
      console.log(this.rows);
    },
  },
};
</script>

<style lang="scss" scoped></style>
