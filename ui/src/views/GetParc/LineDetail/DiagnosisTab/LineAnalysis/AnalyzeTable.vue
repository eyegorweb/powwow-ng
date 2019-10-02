<template>
  <div class="bg-white p-2">
    <PaginatedDataTable :columns="columns" :fetch-data-fn="getFetchDataFn()" :size="7" />
  </div>
</template>

<script>
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable';
import { col } from '@/components/DataTable/utils';
import { accessPointsByLocalisation } from '@/api/geographicalLocation';

export default {
  props: {
    line: Object,
    localisationType: {
      type: String,
      default: 'CP',
    },
  },
  components: {
    PaginatedDataTable,
  },
  data() {
    return {
      columns: [
        col('ICCID', 'geolocation', true, false, { type: 'ObjectAttribute', path: 'iccid' }),
        col('MSISDN', 'geolocation', true, false, { type: 'ObjectAttribute', path: 'msisdn' }),
        col('Opérateur', 'operator'), // ?
        col('Pays', 'geolocation', true, false, { type: 'ObjectAttribute', path: 'countryCode' }),
        col('Code postal', 'geolocation', true, false, {
          type: 'ObjectAttribute',
          path: 'zipCode',
        }),
        col('Ville', 'geolocation', true, false, {
          type: 'ObjectAttribute',
          path: 'cityName',
        }),
        col('Dernier usage', 'geolocation', false, false, {
          type: 'ObjectAttribute',
          path: 'lastCommunicationDate',
        }),
        col('IMSI', 'geolocation', false, false, {
          type: 'ObjectAttribute',
          path: 'imsi',
        }),
        col('IMEI', 'geolocation', false, false, {
          type: 'ObjectAttribute',
          path: 'imei',
        }),
        col('PLMN', 'geolocation', false, false, {
          type: 'ObjectAttribute',
          path: 'plmn',
        }),
        col('Id de cellule', 'geolocation', false, false, {
          type: 'ObjectAttribute',
          path: 'cellId',
        }),
        col('Type usage', 'geolocation', false, false, {
          type: 'ObjectAttribute',
          path: 'usageType',
        }),
        col('Technologie', 'geolocation', false, false, {
          type: 'ObjectAttribute',
          path: 'ticketGeneration',
        }),
        col('Statut DATA', 'geolocation', false, false, {
          type: 'ObjectAttribute',
          path: 'pdpConnectionStatus',
        }),
      ],
    };
  },
  methods: {
    getFetchDataFn() {
      return async pageInfo => {
        const response = await accessPointsByLocalisation(this.line.id, pageInfo, 'CELL');
        return { rows: response.items, total: response.total };
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
