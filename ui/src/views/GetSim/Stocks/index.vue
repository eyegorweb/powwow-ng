<template>
  <div class="mt-4">
    <div class="row mb-0">
      <div class="col-md-9">
        <h4>
          <b>GetSim</b>
          - {{ $t('menu.getSim.manage-stocks') }}
          <Tooltip direction="right">{{ $t('getsim.stocks.tooltip-text') }}</Tooltip>
        </h4>
      </div>
      <div class="col-md-3">
        <UiButton variant="accent" block class="float-right" @click="importFile()">
          {{ $t('getsim.stocks.table.import-file') }}
        </UiButton>
      </div>
    </div>

    <TableWithFilter
      v-if="columns && filters"
      :key="version"
      :storage-version="'001'"
      :storage-id="'getSim.stocks'"
      show-reset
      :filters="filters"
      :columns="columns"
      :is-loading="isLoading"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :size="5"
      @applyFilters="applyFilters"
      @currentFiltersChange="onCurrentFilterChange"
      :default-values="defaultFilterValues"
      @resetSearch="resetFilters"
      @columnOrdered="orderedColumns = $event"
      :init-page-limit="lastPagination ? lastPagination.limit : 10"
    >
      <div slot="topRight" class="tar" v-if="total">
        <ExportButton :export-fn="getExportFn()" :columns="orderedColumns" :order-by="orderBy">
          <span slot="title">{{ $t('getsim.stocks.export', { total: total }) }}</span>
        </ExportButton>
      </div>
      <div slot="title" class="mt-2 table-total">
        {{ $t('getsim.stocks.table.total', { total: formattedTotal }) }}
      </div>
    </TableWithFilter>
  </div>
</template>

<script>
import Tooltip from '@/components/ui/Tooltip';
import TableWithFilter from '@/components/Filters/TableWithFilter';
import UiButton from '@/components/ui/Button';
import PartnerFilter from '@/components/Filters/filterbar/PartnerFilter';
import SimcardTypeFilter from '@/components/Filters/filterbar/SimcardTypeFilter.vue';
import { fetchEsimStockProfiles, exportEsimStocks } from '@/api/esim.js';
import { mapGetters, mapMutations } from 'vuex';
import { formatLargeNumber } from '@/utils/numbers';
import TypeSimCardCell from './TypeSimCardCell';
import InfoStockNoPreactCell from './InfoStockNoPreactCell';
import InfoStockPreactCell from './InfoStockPreactCell';
import InfoStockActiveCell from './InfoStockActiveCell';
import ExportButton from '@/components/ExportButton';

export default {
  name: 'GetEsimStocks',

  components: {
    Tooltip,
    TableWithFilter,
    ExportButton,
    UiButton,
  },

  data() {
    return {
      version: 0,
      defaultFilterValues: undefined,
      currentFilters: undefined,
      lastOrderBy: undefined,
      lastPagination: undefined,
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      total: 0,
      rows: [],
      isLoading: false,
      filters: undefined,
      orderedColumns: undefined,
      columns: [
        {
          id: 2,
          label: this.$t('col.partner'),
          name: 'partner',
          orderable: true,
          visible: true,
          format: {
            type: 'Getter',
            getter: (row) => {
              return this.$loGet(row, 'party.name');
            },
          },
        },
        {
          id: 3,
          label: this.$t('filters.lines.typeSIMCard'),
          name: 'typeSIMCard',
          orderable: true,
          visible: true,
          format: {
            component: TypeSimCardCell,
          },
        },
        {
          id: 4,
          label: this.$t('getparc.actLines.networkStatuses.NOT_PREACTIVATED'),
          name: 'NOT_PREACTIVATED',
          orderable: true,
          visible: true,
          format: {
            component: InfoStockNoPreactCell,
          },
        },
        {
          id: 5,
          label: this.$t('getparc.actLines.networkStatuses.PREACTIVATED'),
          name: 'PREACTIVATED',
          orderable: true,
          visible: true,
          format: {
            component: InfoStockPreactCell,
          },
        },
        {
          id: 6,
          label: this.$t('col.active'),
          name: 'active',
          orderable: true,
          visible: true,
          format: {
            component: InfoStockActiveCell,
          },
        },
        {
          id: 7,
          label: 'EID disponible',
          name: 'eid',
          orderable: true,
          visible: true,
          format: {
            type: 'Getter',
            getter: (row) => {
              return this.$loGet(row, 'eidStockAvailable');
            },
          },
        },
      ],
    };
  },

  mounted() {
    this.prepareFilterBar();
    this.applyFilters();
  },

  computed: {
    ...mapGetters(['userIsPartner']),
    formattedTotal() {
      return formatLargeNumber(this.total);
    },
    currentPartners() {
      if (!this.currentFilters) return [];

      const foundFilter = this.currentFilters.find((f) => f.id === 'filters.partners');
      if (foundFilter && foundFilter.values && foundFilter.values.length) {
        return foundFilter.values;
      }

      return [];
    },
  },

  methods: {
    ...mapMutations(['openPanel']),

    getExportFn() {
      return async (columnsParam, orderBy, exportFormat) => {
        return await exportEsimStocks(
          columnsParam,
          this.orderBy,
          exportFormat,
          this.currentAppliedFilters
        );
      };
    },
    prepareFilterBar() {
      const filters = [];
      if (!this.userIsPartner) {
        filters.push({
          title: 'filters.partners',
          component: PartnerFilter,
          getPageContext: () => {
            return { category: true };
          },
          onChange(chosenValues) {
            return {
              id: 'filters.partners',
              values: chosenValues,
            };
          },
        });
      }
      filters.push({
        title: 'filters.lines.typeSIMCard',
        component: SimcardTypeFilter,
        getPageContext: () => {
          return { partners: this.currentPartners, category: 'ESIM' };
        },
        onChange(chosenValues) {
          return {
            id: 'filters.lines.typeSIMCard',
            values: chosenValues,
          };
        },
      });

      this.filters = filters;
    },

    formatForApi(filters) {
      return filters.reduce((formatted, filter) => {
        if (filter.id === 'filters.partners') {
          formatted.partyId = {
            in: filter.values.map((v) => v.id),
          };
        }

        if (filter.id === 'filters.lines.typeSIMCard') {
          formatted.simCardTypeId = {
            in: filter.values.map((v) => v.data.simCard.id),
          };
        }

        return formatted;
      }, {});
    },

    async applyFilters(payload) {
      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 20 },
        filters: [],
      };

      this.isLoading = true;
      const data = await fetchEsimStockProfiles(this.formatForApi(filters), pagination);
      this.isLoading = false;

      this.total = data.total;
      this.rows = data.items;
    },

    onCurrentFilterChange($event) {
      this.currentFilters = $event;
      this.$emit('currentFiltersChange', $event);
    },

    async resetFilters() {
      this.defaultFilterValues = undefined;
      this.version += 1;
      await this.applyFilters();
    },

    importFile() {
      this.openPanel({
        title: this.$t('getsim.stocks.title'),
        panelId: 'getsim.stocks.title',
        wide: false,
        backdrop: true,
        ignoreClickAway: true,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tar {
  text-align: right;
}
</style>
