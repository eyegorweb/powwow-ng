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
            :size="0"
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
              <SearchByLinesId @searchById="searchById" :init-value="searchByIdValue" />
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
import Indicators from '@/components/Indicators';
import Top5Manufacturer from './Top5Manufacturer';
import TechnologyRepartitionGraph from './TechnologyRepartitionGraph';
import Top5References from './Top5References';
import deviceIndicators from './deviceIndicators';

import { getDevices } from '@/api/manufacturers.js';

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
      columns: [],
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

      const data = await getDevices(this.orderBy, pagination, filters);
      this.total = data.total;
      this.rows = data.items;
      this.currentAppliedFilters = filters;
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
