<template>
  <div class="bg-white p-2 mt-2 analyze-container">
    <div class="row mb-3">
      <div class="col">
        <h2 class="text-gray font-weight-light" style="font-size: 2rem">
          {{ $t('getparc.actLines.total', { total: formattedTotal }) }}
        </h2>
      </div>
      <div class="col" v-if="hasResults">
        <ExportButton :export-fn="getExportFn()" :columns="orderedColumns" :order-by="pageInfo">
          <span slot="title">{{
            $t('getparc.history.details.EXPORT_LINES', { total: formattedTotal })
          }}</span>
        </ExportButton>
      </div>
    </div>

    <div>
      <button class="modal-default-button btn btn-light btn-sm ml-1" disabled v-if="isLoading">
        {{ $t('loading') }}
        <CircleLoader />
      </button>
      <template v-else>
        <DataTable
          v-if="orderBy"
          storage-id="getparc.analyze"
          storage-version="12"
          :columns.sync="columns"
          :rows="rows || []"
          :page.sync="page"
          :total="total || 0"
          :order-by.sync="orderBy"
          :page-limit.sync="pageLimit"
          :size="7"
          :show-extra-columns.sync="showExtraCells"
          @colEvent="$emit('colEvent', $event)"
          @columnOrdered="orderedColumns = $event"
        >
          <template slot="topLeftCorner">
            <SearchByLinesId @searchById="searchById" />
          </template>
        </DataTable>
      </template>
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import CircleLoader from '@/components/ui/CircleLoader';
import { col } from '@/components/DataTable/utils';
import {
  accessPointsByLocalisation,
  exportAccessPointsByLocalisation,
} from '@/api/geographicalLocation';
import SearchByLinesId from '@/views/GetParc/ActLines/SearchByLinesId';
import ExportButton from '@/components/ExportButton';
import { formatLargeNumber } from '@/utils/numbers';

export default {
  props: {
    line: Object,
    localisationType: {
      type: String,
      default: 'CP',
    },
  },
  components: {
    DataTable,
    CircleLoader,
    SearchByLinesId,
    ExportButton,
  },

  data() {
    return {
      orderedColumns: undefined,
      columns: [
        col(
          1,
          'ICCID',
          'geolocation',
          true,
          false,
          { type: 'ObjectAttribute', path: 'iccid' },
          { exportId: 'ICCID' }
        ),
        col(
          2,
          'MSISDN',
          'geolocation',
          true,
          false,
          { type: 'ObjectAttribute', path: 'msisdn' },
          { exportId: 'MSISDN' }
        ),
        col(
          3,
          'Opérateur',
          'geolocation',
          true,
          false,
          {
            type: 'ObjectAttribute',
            path: 'operator',
          },
          { exportId: 'OPERATOR' }
        ),
        col(
          4,
          'Pays',
          'geolocation',
          true,
          false,
          { type: 'ObjectAttribute', path: 'countryCode' },
          { exportId: 'COUNTRY' }
        ),
        col(
          5,
          'Code postal',
          'geolocation',
          true,
          false,
          {
            type: 'ObjectAttribute',
            path: 'zipCode',
          },
          { exportId: 'ZIP_CODE' }
        ),
        col(
          6,
          'Ville',
          'geolocation',
          true,
          false,
          {
            type: 'ObjectAttribute',
            path: 'cityName',
          },
          { exportId: 'CITY' }
        ),
        col(
          7,
          'Dernier usage',
          'geolocation',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'lastCommunicationDate',
          },
          { exportId: 'LAST_USAGE' }
        ),
        col(
          'IMSI',
          'geolocation',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'imsi',
          },
          { exportId: 'IMSI' }
        ),
        col(
          8,
          'IMEI',
          'geolocation',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'imei',
          },
          { exportId: 'IMEI' }
        ),
        col(
          9,
          'PLMN',
          'geolocation',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'plmn',
          },
          { exportId: 'PLMN' }
        ),
        col(
          10,
          'Id de cellule',
          'geolocation',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'cellId',
          },
          { exportId: 'CELL_ID' }
        ),
        col(
          11,
          'Type usage',
          'geolocation',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'usageType',
          },
          { exportId: 'USAGE_TYPE' }
        ),
        col(
          12,
          'Technologie',
          'geolocation',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'ticketGenerationTranslated',
          },
          { exportId: 'TECHNO' }
        ),
        col(
          13,
          'Statut DATA',
          'geolocation',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'pdpConnectionStatus',
          },
          { exportId: 'CONNECTION_STATUS' }
        ),
        col(
          14,
          'Date de début',
          'geolocation',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'pdpConnectionStartDate',
          },
          { exportId: 'CONNECTION_START_DATE' }
        ),
        col(
          15,
          'Date de fin',
          'geolocation',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'pdpConnectionEndDate',
          },
          { exportId: 'CONNECTION_END_DATE' }
        ),
        col(
          16,
          'Statut réseau',
          'geolocation',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'networkStatus',
          },
          { exportId: 'NETWORKK_STATUS' }
        ),
        col(
          17,
          'Offre',
          'geolocation',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'offerCode',
          },
          { exportId: 'OFFER_CODE' }
        ),
        col(
          18,
          'Nom du partenaire',
          'geolocation',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'Party.name',
          },
          { exportId: 'PARTNER_NAME' }
        ),
        col(
          19,
          'Référence commerciale',
          'deviceInstance',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'deviceReference',
          },
          { exportId: 'DEVICE_REFERENCE' }
        ),
        col(
          20,
          'Constructeur',
          'deviceInstance',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'manufacturer',
          },
          { exportId: 'MANUFACTURER' }
        ),
        col(
          21,
          'Type IP',
          'geolocation',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'ipAddressType',
          },
          { exportId: 'IP_TYPE' }
        ),
        col(
          22,
          'Adresse IPv4',
          'geolocation',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'ipV4Address',
          },
          { exportId: 'IP_V4_ADDRESS' }
        ),
        col(
          23,
          'Adresse IPv6',
          'geolocation',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'ipV6Address',
          },
          { exportId: 'IP_V6_ADDRESS' }
        ),
        col(
          24,
          'APN',
          'geolocation',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'apn',
          },
          { exportId: 'APN' }
        ),
        col(
          25,
          'Adresse',
          'geolocation',
          false,
          false,
          {
            type: 'ObjectAttribute',
            path: 'cellAddress',
          },
          { exportId: 'ADDRESS' }
        ),
      ],
      additionalFilters: [],
      total: 0,
      isLoading: false,
      showExtraCells: false,
      orderBy: undefined,
      rows: undefined,
      page: 1,
      pageLimit: 20,
      ready: false,
    };
  },
  watch: {
    page() {
      if (!this.ready) return;
      this.refreshTable();
    },
    orderBy() {
      if (!this.ready) return;
      this.page = 1;
      this.refreshTable();
    },
    pageLimit() {
      if (!this.ready) return;
      this.page = 1;
      this.refreshTable();
    },
  },
  computed: {
    formattedTotal() {
      return formatLargeNumber(this.total);
    },
    pageInfo() {
      return { page: this.page - 1, limit: this.pageLimit };
    },
    hasResults() {
      return !!(this.rows && this.rows.length);
    },
  },
  mounted() {
    this.orderBy = { ...this.order };
    this.refreshTable();
    this.ready = true;
  },
  methods: {
    searchById(params) {
      this.refreshTable([params]);
    },
    getExportFn() {
      return async (columnsParam, orderBy, exportFormat) => {
        const filters = [
          {
            id: 'filters.simcardId',
            value: this.line.id,
          },
        ];
        return await exportAccessPointsByLocalisation(
          filters,
          columnsParam,
          exportFormat,
          false,
          this.localisationType
        );
      };
    },
    async refreshTable(additionalFilters = []) {
      this.isLoading = true;
      const response = await this.fetchApi(additionalFilters);
      this.isLoading = false;
      this.rows = response.rows;
      this.total = response.total;
    },
    async fetchApi(additionalFilters) {
      try {
        const filters = [
          {
            id: 'filters.simcardId',
            value: this.line.id,
          },
          ...additionalFilters,
        ];
        const response = await accessPointsByLocalisation(
          filters,
          this.pageInfo,
          this.localisationType
        );
        return { rows: response.items, total: response.total };
      } catch (e) {
        console.log(e.message);
        return { rows: [], total: 0 };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.analyze-container {
  min-height: 10rem;
}
</style>
