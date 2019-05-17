<template>
  <LoaderContainer :is-loading="false">
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
            <ExportButton
              :export-fn="getExportFn()"
              :columns="columns"
              :order-by="{ key: 'id', direction: 'DESC' }"
            >
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
            <SearchByActId />
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
import { exportLines, fetchUnitActions } from '@/api/unitActions';

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
    changeCellsOrder(orderedCells) {
      const notVisibleCells = this.columns.filter(c => !c.visible);
      this.columns = orderedCells.concat(notVisibleCells);
    },
    getExportFn() {
      return exportLines;
    },
    async fetchUnitActs() {
      const response = await fetchUnitActions(
        this.$route.params.massActionId,
        this.statuses,
        this.getPageInfo,
        this.orderBy
      );
      this.rows = response.items;
      this.$emit('update:total', response.total);
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
    appliedFilters() {
      this.fetchUnitActs();
    },
  },
  data() {
    return {
      rows: [],
      page: 1,
      pageLimit: 20,
      orderBy: {
        key: 'id',
        direction: 'DESCENDING',
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
          label: this.$t('getparc.actDetail.col.msisdn'),
          name: 'msisdn',
          orderable: true,
          visible: true,
          exportId: 'LINE_MSISDN',
        },
        {
          id: 3,
          label: this.$t('getparc.actDetail.col.iccid'),
          name: 'iccid',
          orderable: true,
          visible: true,
          exportId: 'LINE_ICCID',
        },
        {
          id: 4,
          label: this.$t('getparc.actDetail.col.actState'),
          name: 'status',
          orderable: true,
          visible: true,
          exportId: 'LINE_SIM_STATUS_DATE',
        },
        {
          id: 6,
          label: this.$t('getparc.actDetail.col.startDate'),
          name: 'dueDate',
          orderable: true,
          visible: true,
          // exportId: 'UNKNOWN',
        },
        {
          id: 7,
          label: this.$t('getparc.actDetail.col.endDate'),
          name: 'statusDate',
          orderable: true,
          visible: true,
          // exportId: 'UNKNOWN',
        },
        {
          id: 8,
          label: this.$t('getparc.actDetail.col.imsi'),
          name: 'imsi',
          orderable: true,
          visible: true,
          exportId: 'LINE_IMSI',
        },
        {
          id: 10,
          label: this.$t('getparc.actDetail.col.constructor'),
          name: 'manufacturer',
          orderable: true,
          visible: false,
          exportId: 'LINE_MANUFACTURER',
        },
        {
          id: 11,
          label: this.$t('getparc.actDetail.col.commercialRef'),
          name: 'deviceReference',
          orderable: true,
          visible: false,
          exportId: 'LINE_DEVICE_REFERENCE',
        },
        {
          id: 12,
          label: this.$t('getparc.actDetail.col.imei'),
          name: 'imei',
          orderable: true,
          visible: false,
          // exportId: 'UNKNOWN',
        },
      ],
    };
  },
};
</script>

<style scoped></style>
