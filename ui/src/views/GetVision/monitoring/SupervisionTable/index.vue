<template>
  <div>
    <PlmnDistribution :filters-for-export="filtersForExport" :show="canShowPlmn()">
    </PlmnDistribution>
    <template v-if="indicatorTotal < 500">
      <template v-if="total === 0">
        <UiButton variant="outline-primary" @click="$emit('gotomap')">
          <i class="ic-Pin-Icon"></i>
          {{ $t('getparc.lineDetail.tab2.supervisionContent.mapView') }}
        </UiButton>
      </template>
      <PaginatedDataTable
        storage-id="supervision.table"
        storage-version="002"
        :key="version"
        :columns="columns"
        :fetch-data-fn="fetchDataFn()"
        :size="7"
        :order="orderBy"
        :business-error="businessError"
      >
        <template slot="topRightCorner">
          <ExportButton :export-fn="getExportFn()" :columns="columns" :order-by="orderBy">
            <span slot="title">{{ $t('getparc.actLines.export', { total: indicatorTotal }) }}</span>
          </ExportButton>
        </template>
        <template slot="topLeftCorner">
          <UiButton variant="outline-primary" @click="$emit('gotomap')">
            <i class="ic-Pin-Icon"></i>
            {{ $t('getparc.lineDetail.tab2.supervisionContent.mapView') }}
          </UiButton>
        </template>
        <template slot="noResult">
          <div class="mt-2 alert alert-light m-0" role="alert">
            {{ $t('noResult') }}
          </div>
        </template>
        <template slot="businessError">
          <div v-if="indicatorTotal">
            <div class="mb-2 d-flex justify-content-between">
              <UiButton variant="outline-primary" @click="$emit('gotomap')">
                <i class="ic-Pin-Icon"></i>
                {{ $t('getparc.lineDetail.tab2.supervisionContent.mapView') }}
              </UiButton>
              <ExportButton :export-fn="getExportFn()" :columns="columns" :order-by="orderBy">
                <span slot="title">{{
                  $t('getparc.actLines.export', { total: $formatLargeNumber(indicatorTotal) })
                }}</span>
              </ExportButton>
            </div>
            <div class="alert alert-warning" role="alert">
              {{ $t('getvsion.msgGlobalParcExport') }}
            </div>
          </div>
          <div v-else>
            <div class="mt-2 alert alert-light m-0" role="alert">
              {{ $t('noResult') }}
            </div>
          </div>
        </template>
      </PaginatedDataTable>
    </template>
    <template v-else-if="indicatorTotal >= 500 && indicatorTotal <= 100000">
      <div class="d-flex justify-content-between">
        <UiButton variant="outline-primary" @click="$emit('gotomap')">
          <i class="ic-Pin-Icon"></i>
          {{ $t('getparc.lineDetail.tab2.supervisionContent.mapView') }}
        </UiButton>
        <ExportButton :export-fn="getExportFn()" :columns="columns" :order-by="orderBy">
          <span slot="title">{{
            $t('getparc.actLines.export', { total: $formatLargeNumber(indicatorTotal) })
          }}</span>
        </ExportButton>
      </div>
      <div class="alert alert-warning mt-2">{{ $t('getvsion.msgSynchronousExport') }}.</div>
    </template>
    <template v-else-if="indicatorTotal >= 100000">
      <div class="d-flex justify-content-between">
        <UiButton variant="outline-primary" @click="$emit('gotomap')">
          <i class="ic-Pin-Icon"></i>
          {{ $t('getparc.lineDetail.tab2.supervisionContent.mapView') }}
        </UiButton>
        <ExportButton :export-fn="getExportFn()" :columns="columns" :order-by="orderBy">
          <span slot="title">{{
            $t('getparc.actLines.export', { total: $formatLargeNumber(indicatorTotal) })
          }}</span>
        </ExportButton>
      </div>
      <div class="alert alert-warning mt-2">{{ $t('getvsion.msgDeferExport') }}.</div>
    </template>
  </div>
</template>

<script>
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable';
import UiButton from '@/components/ui/Button';
import ExportButton from '@/components/ExportButton';
import { geoListExport, geoCounterListExport } from '@/api/supervision.js';
import ICCIDCell from './ICCIDCell';
import PlmnDistribution from './PlmnDistibution';

export default {
  components: {
    PaginatedDataTable,
    UiButton,
    ExportButton,
    PlmnDistribution,
  },

  props: {
    refreshLinesFn: Function,
    indicatorTotal: Number,
    filtersForExport: Object,
  },

  data() {
    return {
      version: 0,
      rows: undefined,
      total: 0,
      searchError: false,
      businessError: false,

      columns: [
        {
          id: '1',
          label: this.$t('getparc.actDetail.col.iccid'),
          orderable: true,
          visible: true,
          name: 'iccid',
          noHandle: true,
          format: {
            component: ICCIDCell,
          },
        },
        {
          id: '2',
          label: this.$t('getparc.actDetail.col.msisdn'),
          name: 'msisdn',
          orderable: true,
          sortingName: 'msisdn',
          visible: true,
          noHandle: true,
        },
        {
          id: '3',
          label: this.$t('getparc.actDetail.col.imsi'),
          orderable: true,
          visible: false,
          name: 'imsi',
          sortingName: 'imsi',
        },
        {
          id: '4',
          label: this.$t('filters.country'),
          orderable: true,
          visible: true,
          name: 'country',
          sortingName: 'countryName',
          format: {
            type: 'Getter',
            getter: (row) => {
              return row.countryName || row.countryNameFr;
            },
          },
        },
        {
          id: '5',
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.operator'
          ),
          orderable: false,
          visible: true,
          name: 'operatorName',
        },
        {
          id: '6',
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.plmn'
          ),
          orderable: true,
          visible: false,
          name: 'plmn',
          sortingName: 'plmn',
        },
        {
          id: '7',
          label: this.$t('filters.postalCode'),
          orderable: true,
          visible: true,
          name: 'zipCode',
          sortingName: 'zipcode',
        },
        {
          id: '8',
          label: this.$t('filters.city'),
          orderable: false,
          visible: false,
          name: 'city',
        },
        {
          id: '9',
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.cellId'
          ),
          orderable: true,
          visible: false,
          name: 'cellid',
          sortingName: 'cellid',
        },
        {
          id: '10',
          label: this.$t('filters.lastUsage'),
          orderable: true,
          visible: false,
          name: 'lastUsageDate',
          sortingName: 'lastUsageDate',
        },
        {
          id: '11',
          label: this.$t('filters.usageType'),
          orderable: true,
          visible: false,
          name: 'lastUsageType',
          sortingName: 'lastUsageType',
        },
        {
          id: '12',
          label: this.$t('filters.direction'),
          orderable: false,
          visible: false,
          name: 'lastDirection',
        },
        {
          id: '13',
          label: this.$t('getparc.lineDetail.tab2.lineAnalysisContent.technology'),
          orderable: false,
          visible: false,
          name: 'technology',
        },
        {
          id: '14',
          label: this.$t('filters.pdpStatus'),
          orderable: true,
          visible: false,
          name: 'lastPdpConStatus',
          sortingName: 'lastPdpConStatus',
        },
        {
          id: '15',
          label: this.$t('filters.actDateStart'),
          orderable: true,
          visible: false,
          name: 'lastPdpConStartDate',
          sortingName: 'lastPdpConStartDate',
        },
        {
          id: '16',
          label: this.$t('filters.actDateEnd'),
          orderable: true,
          visible: false,
          name: 'lastPdpConEndDate',
          sortingName: 'lastPdpConEndDate',
        },
        {
          id: '17',
          label: this.$t('getparc.actDetail.col.imei'),
          orderable: true,
          visible: false,
          name: 'imei',
          sortingName: 'imei',
        },
        {
          id: '18',
          label: this.$t('getadmin.partnerDetail.address'),
          orderable: true,
          visible: false,
          name: 'address',
        },
        {
          id: '19',
          label: this.$t('filters.lines.networkStatus'),
          orderable: true,
          visible: false,
          name: 'networkStatus',
          sortingName: 'networkStatus',
        },
        {
          id: '20',
          label: this.$t('col.offer'),
          orderable: true,
          visible: false,
          name: 'offerLabel',
          sortingName: 'offerLabel',
        },
        {
          id: '21',
          label: this.$t('col.partner'),
          orderable: false,
          visible: false,
          name: 'partyName',
        },
      ],
      currentPage: 1,
      orderBy: { key: 'lastUsageDate', direction: 'ASC' },
    };
  },

  watch: {
    fetchDataFn() {
      this.version += 1;
    },
  },

  methods: {
    canShowPlmn() {
      return (
        this.filtersForExport &&
        this.filtersForExport.locationType &&
        this.filtersForExport.locationType != 'CONTINENT'
      );
    },
    getExportFn() {
      return async (columnsParam, orderBy, exportFormat, asyncExportRequest) => {
        const sorting = {};
        sorting[orderBy.key] = orderBy.direction;
        const columns = [
          ...columnsParam,
          'MSISDN',
          'ICCID',
          'IMSI',
          'COUNTRY_NAME',
          'OPERATOR_NAME',
          'PLMN',
          'ZIPCODE',
          'CITY',
          'CELL_ID',
          'LAST_USAGE_DATE',
          'LAST_USAGE_TYPE',
          'USAGE_DETAILS',
          'DIRECTION',
          'TICKET_GENERATION',
          'LAST_PDP_CON_STATUS',
          'LAST_PDP_CON_START_DATE',
          'LAST_PDP_CON_END_DATE',
          'IMEI',
          'DEVICE_REFERENCE',
          'DEVICE_MANUFACTURER',
          'ADDRESS',
          'NETWORK_STATUS',
          'OFFER',
          'ADDRESS_IP_TYPE',
          'ADDRESS_IP_V4',
          'ADDRESS_IP_V6',
          'APN',
          'PARTY_NAME',
        ];
        if (
          this.filtersForExport &&
          this.filtersForExport.counter &&
          !this.filtersForExport.activityType
        ) {
          return await geoCounterListExport({
            filter: this.filtersForExport,
            columns,
            asyncExportRequest,
            exportFormat,
          });
        } else if (
          this.filtersForExport &&
          !this.filtersForExport.counter &&
          this.filtersForExport.activityType
        ) {
          return await geoListExport({
            filter: this.filtersForExport,
            columns,
            asyncExportRequest,
            exportFormat,
          });
        }
      };
    },
    fetchDataFn() {
      return async (pageInfo, orderBy) => {
        const sorting = {};
        sorting[orderBy.key] = orderBy.direction;
        try {
          this.searchError = false;
          const response = await this.refreshLinesFn(pageInfo, sorting);
          if (response && response.errors) {
            this.businessError = !!response.errors;
            return {
              rows: undefined,
              total: response.total || this.indicatorTotal,
              errors: response.errors,
            };
          }
          this.total = response.total;
          return {
            rows: response.items,
            total: response.total || this.indicatorTotal,
          };
        } catch (error) {
          this.searchError = true;
        }
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
