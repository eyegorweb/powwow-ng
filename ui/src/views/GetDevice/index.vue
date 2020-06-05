<template>
  <div class="mt-4">
    <div class="row mb-4">
      <div class="col-md-9">
        <h4>
          <b>GetDevice</b>
          - {{ $t('getdevice.title') }}
          <Tooltip direction="right">{{ $t('getdevice.tooltip') }}</Tooltip>
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
                  <Top5Manufacturer
                    :refresh-data="refreshDataTop5Manufacturers"
                    :chart-options="chartOptions"
                  />
                </div>
                <div class="col-4">
                  <TechnologyRepartitionGraph
                    :refresh-data="refreshDataTechnoRepartition"
                    :chart-options="chartOptions2"
                  />
                </div>
                <div class="col-4">
                  <Top5References
                    :refresh-data="refreshDataTop5References"
                    :chart-options="chartOptions3"
                  />
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
import { getDevices, exportDevices } from '@/api/manufacturers';
import {
  lineDistributionByManufacturer,
  lineDistributionByTechno,
  lineDistributionByDeviceReference,
} from '@/api/deviceGraph';
import PartnerNameFilter from '@/views/GetAdmin/SearchUsers/filters/PartnerFilter.vue';
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
          title: this.$t('getdevice.tab-1-inventory'),
        },
        {
          label: 'boxes',
          title: this.$t('getdevice.tab-2-boxes'),
          disable: true,
        },
        {
          label: 'conso-energy',
          title: this.$t('getdevice.tab-3-conso-energy'),
          disable: true,
        },
        {
          label: 'google-device',
          title: this.$t('getdevice.tab-4-google-device'),
          disable: true,
        },
      ],
      currentTab: 0,
      searchByIdValue: undefined,
      indicators: deviceIndicators,
      columns: [
        {
          id: 1,
          label: 'IMEI',
          name: 'imei',
          exportId: 'IMEI',
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
          exportId: 'MANUFACTURER',
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
          exportId: 'DEVICE_REFERENCE',
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
          exportId: 'TAC',
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
          exportId: 'BANDS',
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
          exportId: 'ICCID',
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
          id: 7,
          label: 'Partenaire',
          name: 'partyName',
          exportId: 'PARTY',
          orderable: true,
          visible: false,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'party.name');
            },
          },
          visibleWhen: () => {
            return this.canShowPartnerColumn;
          },
        },
        {
          id: 8,
          label: 'MSISDN',
          name: 'msisdn',
          exportId: 'MSISDN',
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
          exportId: 'IMSI',
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
          exportId: 'SIM_STATUS',
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
          exportId: 'SIM_STATUS_DATE',
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
          exportId: 'OFFER',
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
          id: 13,
          label: 'Dernier pays (ancien PLMN)',
          name: 'lastPLMN',
          exportId: 'USAGE_LAST_COUNTRY',
          orderable: true,
          visible: false,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'lastPLMN');
            },
          },
          visibleWhen: () => {
            return this.canShowPLMNColumn;
          },
        },
        {
          id: 14,
          label: 'A-MSISDN',
          name: 'msisdnA',
          exportId: 'AMSISDN',
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
          title: 'getdevice.partners',
          component: PartnerNameFilter,
          onChange(chosenValues) {
            return {
              id: 'getdevice.partners',
              values: chosenValues,
            };
          },
        },
        {
          title: 'getdevice.imeiRange',
          component: IMEIRange,
          onChange(values) {
            return {
              id: 'getdevice.imeiRange',
              from: values.from,
              to: values.to,
            };
          },
        },
        {
          title: 'getdevice.manufacturer',
          component: Manufacturer,
          onChange(values) {
            return {
              id: 'getdevice.manufacturer',
              values,
            };
          },
        },
        {
          title: 'getdevice.deviceReference',
          component: DeviceReference,
          onChange(values) {
            return {
              id: 'getdevice.deviceReference',
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
      chartOptions: undefined,
      chartOptions2: undefined,
      chartOptions3: undefined,
    };
  },
  mounted() {
    this.applyFilters();
  },
  methods: {
    async applyFilters(payload) {
      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 30 },
        filters: [],
      };
      this.isLoading = true;
      const data = await getDevices(undefined, pagination, filters);
      this.isLoading = false;
      this.total = data.total;
      this.rows = data.items;
      this.currentAppliedFilters = filters;
      if (filters && !filters[0]) {
        this.refreshDataTop5Manufacturers();
        this.refreshDataTechnoRepartition();
        this.refreshDataTop5References();
      } else {
        const partners = filters[0].values.map(p => ({
          id: p.id,
        }));
        const selectedPartnerIds = partners.map(p => p.id);
        this.refreshDataTop5Manufacturers(selectedPartnerIds);
        this.refreshDataTechnoRepartition(selectedPartnerIds);
        this.refreshDataTop5References(selectedPartnerIds);
      }
    },
    async searchById(params) {
      this.searchByIdValue = params.value;

      this.isLoading = true;
      const data = await getDevices(undefined, { page: 0, limit: 10 }, [params]);

      this.isLoading = false;

      this.total = data.total;
      this.rows = data.items;
    },
    getExportFn() {
      return async (columnsParam, orderBy, exportFormat) => {
        return await exportDevices(
          columnsParam,
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
    async refreshDataTop5Manufacturers(partnerIds) {
      const data = await lineDistributionByManufacturer(partnerIds);

      const formatedData = data.reduce((all, item) => {
        all.push({
          name: item.label,
          z: item.accessPointNumber,
          y: item.percentage,
        });
        return all;
      }, []);

      this.chartOptions = {
        chart: {
          type: 'variablepie',
          height: 200,
        },
        plotOptions: {
          variablepie: {
            size: 90,
          },
        },
        title: {
          text: '',
        },
        tooltip: {
          headerFormat: '',
          pointFormat:
            '<span style="color:{point.color}">\u25CF</span> <b> {point.name} : {point.y} %</b><br/>' +
            'Nombre de lignes: <b>{point.z}</b><br/>',
        },
        series: [
          {
            innerSize: '70%',
            zMin: 0,
            name: 'Zone',
            data: formatedData,
          },
        ],
      };
    },
    async refreshDataTechnoRepartition(partnerIds) {
      const data = await lineDistributionByTechno(partnerIds);

      const formatedData = data.reduce((all, item) => {
        all.push({
          name: item.label,
          y: item.accessPointNumber,
        });
        return all;
      }, []);

      this.chartOptions2 = {
        chart: {
          type: 'bar',
          height: 200,
        },
        title: {
          text: '',
        },
        subtitle: {
          text: '',
        },
        xAxis: {
          type: 'category',
          labels: {
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif',
            },
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: '',
          },
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          pointFormat: '<b>{point.y} lignes</b>',
        },
        series: [
          {
            name: 'Population',
            data: formatedData,
          },
        ],
      };
    },
    async refreshDataTop5References(partnerIds) {
      const data = await lineDistributionByDeviceReference(partnerIds);

      const formatedData = data.reduce((all, item) => {
        all.push({
          name: item.label,
          z: item.accessPointNumber,
          y: item.percentage,
        });
        return all;
      }, []);

      this.chartOptions3 = {
        chart: {
          type: 'variablepie',
          height: 200,
        },
        plotOptions: {
          variablepie: {
            size: 90,
          },
        },
        title: {
          text: '',
        },
        tooltip: {
          headerFormat: '',
          pointFormat:
            '<span style="color:{point.color}">\u25CF</span> <b> {point.name} : {point.y} %</b><br/>' +
            'Nombre de lignes: <b>{point.z}</b><br/>',
        },
        series: [
          {
            innerSize: '70%',
            zMin: 0,
            name: 'Zone',
            data: formatedData,
          },
        ],
      };
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
