<template>
  <ConsumptionTable :columns.sync="columns" :fetch-data-fn="getFetchDataFn()" />
</template>

<script>
import ConsumptionTable from './ConsumptionTable';
import { smsUsage } from '@/api/consumption';

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
        const response = await smsUsage(this.simcard.id, pageInfo);
        const rows = response.items.map(r => {
          return { ...r.smsHistory, simcard: this.simcard };
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
          label: this.$t('date'),
          name: 'recordOpeningTime',
          orderable: false,
          visible: true,
        },
        {
          id: 2,
          label: 'Entrant/Sortant',
          orderable: false,
          visible: true,
          format: {
            type: 'Getter',
            getter: row => {
              return row.incoming ? 'Entrant' : 'Sortant';
            },
          },
        },
        {
          id: 3,
          label: this.$t('getparc.actDetail.col.msisdn'),
          name: 'callingNumber', // composant à faire
          orderable: false,
          visible: true,
        },
        /*
        {
          id: 4,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.location'
          ),
          name: 'localisation', // ??
          orderable: false,
          visible: true,
        },
        //*/
        {
          id: 5,
          label: this.$t('filters.country'),
          name: 'countryISO3',
          orderable: false,
          visible: true,
        },
        /*
        {
          id: 6,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.operator'
          ),
          name: 'operator', // ??
          orderable: false,
          visible: true,
        },
        //*/
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
          name: 'zipCode',
          orderable: false,
          visible: false,
        },
        {
          id: 9,
          label: this.$t('filters.city'),
          name: 'city',
          orderable: false,
          visible: false,
        },
        {
          id: 10,
          label: this.$t('getparc.actDetail.col.imei'),
          name: 'imei',
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
          label: this.$t('getparc.actDetail.col.commercialRef'),
          name: 'simcard',
          orderable: false,
          visible: false,
          format: {
            type: 'ObjectAttribute',
            path: 'order.id',
          },
        },
        {
          id: 13,
          label: this.$t('getparc.actLines.col.manufacturer'),
          name: 'simcard',
          orderable: false,
          visible: false,
          format: {
            type: 'ObjectAttribute',
            path: 'deviceInstance.deviceReference',
          },
        },
        {
          id: 15,
          label: 'Longitude',
          name: 'cellLongitude',
          orderable: false,
          visible: false,
        },
        {
          id: 14,
          label: 'Latitude',
          name: 'cellLatitude',
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
};
</script>

<style lang="scss" scoped></style>
