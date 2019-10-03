<template>
  <div class="bg-white p-2 mt-2 analyze-container">
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
        col('Date de début', 'geolocation', false, false, {
          type: 'ObjectAttribute',
          path: 'pdpConnectionStartDate',
        }),
        col('Date de fin', 'geolocation', false, false, {
          type: 'ObjectAttribute',
          path: 'pdpConnectionEndDate',
        }),
        col('Statut réseau', 'geolocation', false, false, {
          type: 'ObjectAttribute',
          path: 'networkStatus',
        }),
        col('Offre', 'geolocation', false, false, {
          type: 'ObjectAttribute',
          path: 'offerCode',
        }),
        col('Nom du partenaire', 'geolocation', false, false, {
          type: 'ObjectAttribute',
          path: 'Party.name',
        }),
        col('Référence commerciale', 'deviceInstance', false, false, {
          type: 'ObjectAttribute',
          path: 'deviceReference',
        }),
        col('Constructeur', 'deviceInstance', false, false, {
          type: 'ObjectAttribute',
          path: 'manufacturer',
        }),
        col('Constructeur', 'deviceInstance', false, false, {
          type: 'ObjectAttribute',
          path: 'manufacturer',
        }),
        col('Type IP', 'geolocation', false, false, {
          type: 'ObjectAttribute',
          path: 'ipAddressType',
        }),
        col('Adresse IPv4', 'geolocation', false, false, {
          type: 'ObjectAttribute',
          path: 'ipV4Address',
        }),
        col('Adresse IPv6', 'geolocation', false, false, {
          type: 'ObjectAttribute',
          path: 'ipV6Address',
        }),
        col('APN', 'geolocation', false, false, {
          type: 'ObjectAttribute',
          path: 'apn',
        }),
      ],
    };
  },
  methods: {
    getFetchDataFn() {
      return async pageInfo => {
        const response = await accessPointsByLocalisation(
          this.line.id,
          pageInfo,
          this.localisationType
        );
        return { rows: response.items, total: response.total };
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.analyze-container {
  min-height: 10rem;
}
</style>
