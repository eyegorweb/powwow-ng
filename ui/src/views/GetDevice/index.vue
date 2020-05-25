<template>
  <div class="mt-4">
    <div class="row mb-4">
      <div class="col-md-9">
        <h4>
          <b>GetDevice</b>
          - {{ $t('getDevice.title') }}
          <Tooltip direction="right">{{ $t('getDevice.title') }}</Tooltip>
        </h4>
      </div>
    </div>
    <div class="mt-4 mb-4">
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
  </div>
</template>

<script>
import Tooltip from '@/components/ui/Tooltip';
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

export default {
  components: {
    Tooltip,
    TableWithFilter,
    SearchByLinesId,
    Indicators,
    Top5Manufacturer,
    TechnologyRepartitionGraph,
    Top5References,
  },
  data() {
    return {
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
      orderBy: { id: 'DESC' },
    };
  },
  methods: {
    applyFilters() {},
    searchById() {},
  },
};
</script>

<style lang="scss" scoped></style>
