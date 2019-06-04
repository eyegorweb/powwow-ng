<template>
  <LoaderContainer :is-loading="isLoading">
    <div>
      <div v-if="!total" class="alert alert-light" role="alert">
        {{ $t('noResult') }}
      </div>
      <div v-else>
        <div class="row mb-3">
          <div class="col">
            <h2 class="text-gray font-weight-light" style="font-size: 2rem">
              {{ $t('getparc.actDetail.title', { total: total }) }}
            </h2>
          </div>
          <div class="col">
            <ExportButton :export-fn="getExportFn()" :columns="columns" :order-by="orderBy">
              <span slot="title">
                {{ $t('getparc.history.details.EXPORT_LINES', { total: total }) }}
              </span>
            </ExportButton>
          </div>
        </div>
        <DataTable
          :columns.sync="columns"
          :rows="rows || []"
          :page.sync="page"
          :page-limit.sync="pageLimit"
          :total="total || 0"
          :order-by.sync="orderBy"
          :show-extra-columns.sync="showExtraCells"
          @change-order="changeCellsOrder"
          :size="7"
        >
          <template slot="topLeftCorner">
            <SearchByActId @searchById="searchById" :options="searchOptions" />
          </template>
        </DataTable>
      </div>
      <slot name="after"> </slot>
    </div>
  </LoaderContainer>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import LoaderContainer from '@/components/LoaderContainer';
import SearchByActId from '@/views/GetParc/SearchByActId';
import ExportButton from '@/components/ExportButton';
import DetailsCell from './DetailsCell';
import { fetchUnitActions } from '@/api/unitActions';
import { exportMassAction } from '@/api/massActions';

export default {
  components: {
    DataTable,
    LoaderContainer,
    SearchByActId,
    ExportButton,
  },
  props: {
    massActionId: String,
    statuses: Array,
    total: Number,
  },

  async mounted() {
    this.fetchUnitActs();
  },

  computed: {
    getPageInfo() {
      return { page: this.page - 1, limit: this.pageLimit };
    },
  },

  methods: {
    async searchById(params) {
      const currentFilters = [params];
      await this.fetchUnitActs(currentFilters);
      this.page = 1;
    },
    changeCellsOrder(orderedCells) {
      const notVisibleCells = this.columns.filter(c => !c.visible);
      this.columns = orderedCells.concat(notVisibleCells);
    },
    getExportFn() {
      return async (columnsParam, orderBy, exportFormat) => {
        return await exportMassAction(
          this.massActionId,
          this.statuses,
          columnsParam,
          this.getPageInfo,
          exportFormat
        );
      };
    },
    async fetchUnitActs(searchFilter = []) {
      this.isLoading = true;
      const response = await fetchUnitActions(
        this.$route.params.massActionId,
        this.statuses,
        this.getPageInfo,
        this.orderBy,
        searchFilter
      );
      this.rows = response.items;
      this.$emit('update:total', response.total);
      this.isLoading = false;
    },
  },

  watch: {
    page() {
      this.fetchUnitActs();
    },
    orderBy() {
      this.page = 1;
      this.fetchUnitActs();
    },
    pageLimit() {
      this.page = 1;
      this.fetchUnitActs();
    },
  },
  data() {
    return {
      isLoading: false,
      searchOptions: [
        {
          code: 'c1',
          value: 'iccid',
          label: 'ICCID',
        },
        {
          code: 'c2',
          value: 'imsi',
          label: 'IMSI',
        },
        {
          code: 'c3',
          value: 'msisdn',
          label: 'MSISDN',
        },
        {
          code: 'c4',
          value: 'msisdnA',
          label: 'A-MSISDN',
        },
        {
          code: 'c5',
          value: 'imei',
          label: 'IMEI',
        },
        {
          code: 'c6',
          value: 'unitActionId',
          label: this.$t('getparc.search.act-unit-id'),
        },
      ],
      rows: [],
      page: 1,
      pageLimit: 20,
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      showExtraCells: false,
      columns: [
        {
          id: 1,
          label: this.$t('getparc.actDetail.col.id'),
          name: 'id',
          orderable: true,
          visible: true,
          // exportId: 'UNKNOWN',
        },
        {
          id: 2,
          label: this.$t('getparc.actDetail.col.details'),
          name: 'ICCID',
          orderable: true,
          visible: true,
          format: {
            component: DetailsCell,
          },
        },
        {
          id: 3,
          label: this.$t('getparc.actDetail.col.msisdn'),
          name: 'msisdn',
          orderable: true,
          visible: true,
          exportId: 'MSISDN',
        },
        {
          id: 3,
          label: this.$t('getparc.actDetail.col.iccid'),
          name: 'ICCID',
          orderable: true,
          visible: true,
          exportId: 'ICCID',
        },

        {
          id: 5,
          label: this.$t('getparc.actDetail.col.actState'),
          name: 'status',
          orderable: true,
          visible: true,
          exportId: 'UNIT_ACTION_STATUS',
        },
        {
          id: 6,
          label: this.$t('getparc.actDetail.col.failDate'),
          name: 'statusDate',
          orderable: true,
          visible: true,
          // exportId: 'UNKNOWN',
        },
        {
          id: 7,
          label: this.$t('getparc.actDetail.col.failReason'),
          name: 'error_reason',
          orderable: true,
          visible: false,
          // exportId: 'UNKNOWN',
        },
        {
          id: 8,
          label: this.$t('getparc.actDetail.col.imsi'),
          name: 'imsi',
          orderable: true,
          visible: false,
          // exportId: 'UNKNOWN',
        },
        {
          id: 9,
          label: this.$t('getparc.actDetail.col.constructor'),
          name: 'manufacturer',
          orderable: true,
          visible: false,
          exportId: 'DEVICE_MANUFACTURER',
        },
        {
          id: 10,
          label: this.$t('getparc.actDetail.col.commercialRef'),
          name: 'deviceReference',
          orderable: true,
          visible: false,
          exportId: 'DEVICE_REFERENCE',
        },
        {
          id: 11,
          label: this.$t('getparc.actDetail.col.imei'),
          name: 'imei',
          orderable: true,
          visible: false,
          exportId: 'IMEI',
        },
      ],
    };
  },
};
</script>

<style scoped></style>
