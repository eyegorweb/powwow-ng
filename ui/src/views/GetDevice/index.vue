<template>
  <div class="mt-4">
    <div class="row mb-4">
      <div class="col-md-9">
        <h4>
          <b>GetDevice</b>
          - {{ $t('getDevice.title') }}
          <Tooltip direction="right">{{ $t('getDevice.tooltip') }}</Tooltip>
        </h4>
      </div>
    </div>
    <div class="mt-4 mb-4">
      <UiTabs :tabs="tabs" :selected-index="currentTab">
        <template slot-scope="{ tab, index, selectedIndex }">
          <UiTab
            v-if="tab"
            :is-selected="index === selectedIndex"
            :disable-menu="tab.disable"
            class="tab-grow"
          >
            <a href="#" @click.prevent="() => (currentTab = index)">{{ tab.title }}</a>
          </UiTab>
        </template>
        <div class="pt-4 pl-4" slot="inventory">
          <TableWithFilter
            v-if="columns"
            :filters="filters"
            :columns="columns"
            :rows="rows"
            :total="total"
            :order-by.sync="orderBy"
            @applyFilters="applyFilters"
          >
            <div slot="before-table">
              <div class="row">
                <div class="col-4">
                  <Top5Manufacturer />
                </div>
                <div class="col-4">
                  <TechnologyRepartitionGraph />
                </div>
                <div class="col-4">
                  <Top5References />
                </div>
              </div>
            </div>
            <div slot="before-filters">
              <Indicators v-if="indicators" :meta="indicators" disable-click precalculated />
            </div>

            <div slot="topLeft">
              <SearchByLinesId
                @searchById="searchById"
                :init-value="searchByIdValue"
                placeholder="searchLine"
              />
            </div>

            <div slot="topRight">
              <ExportButton :export-fn="getExportFn()" :columns="columns" :order-by="orderBy">
                <span slot="title">{{ $t('getparc.actLines.export', { total: total }) }}</span>
              </ExportButton>
            </div>
          </TableWithFilter>
        </div>
        <div slot="boxes"></div>
        <div slot="conso-energy"></div>
        <div slot="google-device"></div>
      </UiTabs>
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/ui/Tooltip';
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';
import TableWithFilter from '@/components/Filters/TableWithFilter';
import IMEIRange from './filters/IMEIRange';
import Manufacturer from './filters/Manufacturer';
import DeviceReference from './filters/DeviceReference';
import SearchByLinesId from '@/components/SearchById';
import ExportButton from '@/components/ExportButton';
import Indicators from '@/components/Indicators';
import Top5Manufacturer from './Top5Manufacturer';
import TechnologyRepartitionGraph from './TechnologyRepartitionGraph';
import Top5References from './Top5References';
import deviceIndicators from './deviceIndicators';
import { getDevices, exportDevices } from '@/api/manufacturers.js';
import get from 'lodash.get';
import { mapGetters } from 'vuex';

export default {
  components: {
    Tooltip,
    UiTabs,
    UiTab,
    TableWithFilter,
    SearchByLinesId,
    Indicators,
    Top5Manufacturer,
    TechnologyRepartitionGraph,
    Top5References,
    ExportButton,
  },
  data() {
    return {
      tabs: [
        {
          label: 'inventory',
          title: this.$t('getDevice.tab-1-inventory'),
        },
        {
          label: 'boxes',
          title: this.$t('getDevice.tab-2-boxes'),
          disable: true,
        },
        {
          label: 'conso-energy',
          title: this.$t('getDevice.tab-3-conso-energy'),
          disable: true,
        },
        {
          label: 'google-device',
          title: this.$t('getDevice.tab-4-google-device'),
          disable: true,
        },
      ],
      currentTab: 0,
      searchByIdValue: undefined,
      indicators: deviceIndicators,
      columns: undefined,
      commonColumns: [
        {
          id: 1,
          label: 'IMEI',
          name: 'imei',
          orderable: true,
          visible: true,
          noHandle: true,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'imei');
            },
          },
        },
        {
          id: 2,
          label: 'Fabricant (IMEI)',
          name: 'manufacturer',
          orderable: true,
          visible: true,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'manufacturer');
            },
          },
        },
        {
          id: 3,
          label: 'Modèle (IMEI)',
          name: 'deviceReference',
          orderable: true,
          visible: true,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'deviceReference');
            },
          },
        },
        {
          id: 4,
          label: 'TAC',
          name: 'tac',
          orderable: false, // Not parametrable for ordering in the api devices
          visible: true,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'tac');
            },
          },
        },
        {
          id: 5,
          label: 'Fréquence',
          name: 'bands',
          orderable: false, // Not parametrable for ordering in the api devices
          visible: true,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'bands');
            },
          },
        },
        {
          id: 6,
          label: 'ICCID',
          name: 'iccid',
          orderable: true,
          visible: true,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'iccid');
            },
          },
        },
        {
          id: 8,
          label: 'MSISDN',
          name: 'msisdn',
          orderable: true,
          visible: false,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'msisdn');
            },
          },
        },
        {
          id: 9,
          label: 'IMSI',
          name: 'imsi',
          orderable: true,
          visible: false,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'imsi');
            },
          },
        },
        {
          id: 10,
          label: 'Statut de la ligne',
          name: 'status',
          orderable: false, // Not parametrable for ordering in the api devices
          visible: false,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'status');
            },
          },
        },
        {
          id: 11,
          label: 'Date du statut',
          name: 'statusDate',
          orderable: true,
          visible: false,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'statusDate');
            },
          },
        },
        {
          id: 12,
          label: 'Offre',
          name: 'offer',
          orderable: true,
          visible: false,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'offer');
            },
          },
        },
        {
          id: 14,
          label: 'A-MSISDN',
          name: 'msisdnA',
          orderable: true,
          visible: false,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'msisdnA');
            },
          },
        },
      ],
      filters: [
        {
          title: 'getDevice.imeiRange',
          component: IMEIRange,
          onChange(values) {
            return {
              id: 'getDevice.imeiRange',
              from: values.from,
              to: values.to,
            };
          },
        },
        {
          title: 'getDevice.manufacturer',
          component: Manufacturer,
          onChange(values) {
            return {
              id: 'getDevice.manufacturer',
              values,
            };
          },
        },
        {
          title: 'getDevice.deviceReference',
          component: DeviceReference,
          onChange(values) {
            return {
              id: 'getDevice.deviceReference',
              values,
            };
          },
        },
      ],
      rows: [],
      total: 0,
      orderBy: {
        key: 'statusDate',
        direction: 'ASC',
      },
      currentAppliedFilters: [],
      isLoading: false,
    };
  },
  mounted() {
    const partnerColumn = [
      {
        id: 7,
        label: 'Partenaire',
        name: 'partyName',
        orderable: true,
        visible: false,
        format: {
          type: 'Getter',
          getter: row => {
            return get(row, 'party.name');
          },
        },
      },
    ];
    const PLMNColumn = [
      {
        id: 13,
        label: 'Dernier pays (ancien PLMN)',
        name: 'lastPLMN',
        orderable: true,
        visible: false,
        format: {
          type: 'Getter',
          getter: row => {
            return get(row, 'lastPLMN');
          },
        },
      },
    ];
    if (this.canShowPartnerColumn) {
      this.columns = [...this.commonColumns, ...partnerColumn];
    } else {
      this.columns = [...this.commonColumns];
    }
    if (this.canShowPLMNColumn) {
      this.columns = [...this.columns, ...PLMNColumn];
    }
    this.applyFilters();
  },
  methods: {
    async applyFilters(payload) {
      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 30 },
        filters: [],
      };

      const data = await getDevices(this.orderBy, pagination, filters);
      this.total = data.total;
      this.rows = data.items;
      this.currentAppliedFilters = filters;
    },
    async searchById(params) {
      this.searchByIdValue = params.value;

      this.isLoading = true;
      const data = await getDevices(this.orderBy, { page: 0, limit: 10 }, [params]);

      this.isLoading = false;

      this.total = data.total;
      this.rows = data.items;
    },
    getExportFn() {
      return async (columnsParam, orderBy, exportFormat) => {
        return await exportDevices(
          [
            'IMEI',
            'MANUFACTURER',
            'DEVICE_REFERENCE',
            'TAC',
            'BANDS',
            'ICCID',
            'PARTY',
            'MSISDN',
            'IMSI',
            'OFFER',
            'USAGE_LAST_COUNTRY',
            'AMSISDN',
            'SIM_STATUS',
            'SIM_STATUS_DATE',
          ],
          this.orderBy,
          exportFormat,
          this.currentAppliedFilters
        );
      };
    },
    havePermission(domain, action) {
      return !!get(this.userInfos, 'permissions', []).find(
        p => p.domain === domain && p.action === action
      );
    },
  },
  computed: {
    ...mapGetters(['userInfos', 'userIsBO']),
    canShowPartnerColumn() {
      return this.userInfos.type === 'OPERATOR' || this.userInfos.type === 'PARTNER_GROUP';
    },
    canShowPLMNColumn() {
      return this.userIsBO && this.havePermission('getVision', 'read');
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-grow {
  flex-grow: 1;
}
a {
  text-transform: uppercase;
}
</style>
