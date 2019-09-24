<template>
  <ConsumptionTable :columns.sync="columns" :fetch-data-fn="getFetchDataFn()" />
</template>

<script>
import ConsumptionTable from './ConsumptionTable';
import { voiceUsage } from '@/api/consumption';

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
        const response = await voiceUsage(this.simcard.id, pageInfo);
        const rows = response.items.map(r => {
          return { ...r.voiceHistory, simcard: this.simcard };
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
          label: 'Durée',
          name: 'duration',
          orderable: false,
          visible: true,
        },
        {
          id: 3,
          label: 'Type',
          name: 'usageType',
          orderable: false,
          visible: true,
        },
        {
          id: 4,
          label: 'Détail usage',
          name: 'details',
          orderable: false,
          visible: true,
        },
        {
          id: 5,
          label: 'Entrant / Sortant',
          name: 'incomming',
          orderable: false,
          visible: false,
        },
        {
          id: 6,
          label: 'MSISDN du correspondant',
          name: 'callingNumber',
          orderable: false,
          visible: false,
        },
        {
          id: 7,
          label: 'ID de la cellule',
          name: 'cellId',
          orderable: false,
          visible: false,
        },
        {
          id: 8,
          label: 'Pays',
          name: 'countryISO3',
          orderable: false,
          visible: false,
        },
        {
          id: 9,
          label: 'PLMN',
          name: 'plmn',
          orderable: false,
          visible: false,
        },
        {
          id: 10,
          label: 'Code postal',
          name: 'zipCode',
          orderable: false,
          visible: false,
        },
        {
          id: 10,
          label: 'ville',
          name: 'city',
          orderable: false,
          visible: false,
        },
        {
          id: 11,
          label: 'IMEI',
          name: 'imei',
          orderable: false,
          visible: false,
        },
        {
          id: 12,
          label: 'Offre',
          name: 'offerCode',
          orderable: false,
          visible: false,
        },
        {
          id: 12,
          label: 'Offre',
          name: 'offerCode',
          orderable: false,
          visible: false,
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
