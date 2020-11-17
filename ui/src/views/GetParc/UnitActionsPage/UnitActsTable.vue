<template>
  <LoaderContainer :is-loading="isLoading">
    <div slot="on-loading">
      <TableSkeleton :columns="columns" :size="3" />
    </div>
    <div>
      <div v-if="!total" class="alert alert-light" role="alert">{{ $t('noResult') }}</div>
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
        <template v-if="rows && rows.length">
          <DataTable
            :columns="columns"
            :rows="rows || []"
            :page.sync="page"
            :page-limit.sync="pageLimit"
            :total="total || 0"
            :order-by.sync="orderBy"
            :show-extra-columns.sync="showExtraCells"
            :size="7"
            v-if="total !== '-'"
            @columnOrdered="orderedColumns = $event"
          >
            <template slot="topLeftCorner">
              <SearchUnitActionsById @searchById="searchById" :init-value="searchByIdValue" />
            </template>
          </DataTable>
        </template>
        <template v-else>
          <div v-if="searchByIdValue">
            <button class="btn btn-link" @click="resetFilters">{{ $t('resetFilters') }}</button>
          </div>
          <div class="alert alert-light">{{ $t('noResult') }}</div>
        </template>
      </div>
      <slot name="after"></slot>
    </div>
  </LoaderContainer>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import LoaderContainer from '@/components/LoaderContainer';
import SearchUnitActionsById from './SearchUnitActionsById';
import ExportButton from '@/components/ExportButton';
import { fetchUnitActions } from '@/api/unitActions';
import { exportMassAction } from '@/api/massActions';
import TableSkeleton from '@/components/ui/skeletons/TableSkeleton';

import { mapMutations } from 'vuex';

export default {
  components: {
    DataTable,
    LoaderContainer,
    SearchUnitActionsById,
    ExportButton,
    TableSkeleton,
  },
  props: {
    massActionId: Number,
    storageId: String,
    storageVersion: String,
    groupedStatus: String,
    total: [Number, String],
    columns: Array,
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
    ...mapMutations(['flashMessage']),

    async searchById(params) {
      this.searchByIdValue = params.value;
      const currentFilters = [params];
      await this.fetchUnitActs(currentFilters);
      this.page = 1;
    },
    async resetFilters() {
      this.searchByIdValue = undefined;
      await this.fetchUnitActs();
      this.page = 1;
    },
    getExportFn() {
      return async (columnsParam, orderBy, exportFormat, asyncExportRequest) => {
        return await exportMassAction(
          this.massActionId,
          ['WAITING', 'SENT', 'IN_PROGRESS', 'OK', 'KO', 'REPLAYED', 'CANCELLED'],
          this.groupedStatus,
          [
            'MASS_ACTION_ID',
            'MASS_ACTION_INFO',
            'UNIT_ACTION_ID',
            'UNIT_ACTION_TYPE',
            'UNIT_ACTION_INFO',
            'ICCID',
            'UNIT_ACTION_STATUS',
            'UNIT_ACTION_START_DATE',
            'UNIT_ACTION_END_DATE',
            'UNIT_ACTION_STATUS_DATE',
            'UNIT_ACTION_STATUS_ERROR',
            'MSISDN',
            'DEVICE_MANUFACTURER',
            'DEVICE_REFERENCE',
            'IMEI',
            'LOGIN',
            'PREACTIVATION_DATE',
            'ACTIVATION_DATE',
          ],
          exportFormat,
          asyncExportRequest
        );
      };
    },
    async fetchUnitActs(searchFilter = []) {
      this.isLoading = true;
      this.$emit('is-loading', true);
      try {
        const response = await fetchUnitActions(
          this.massActionId,
          { groupedStatus: this.groupedStatus },
          this.getPageInfo,
          this.orderBy,
          searchFilter
        );

        this.rows = response.items.map(i => ({ ...i, ...i.unitAction }));
      } catch (e) {
        console.log("fetchUnitActs -> e", e)
        this.flashMessage({
          level: 'danger',
          message: "Erreur lors de l'éxécution de la requette ",
        });
      }

      this.isLoading = false;
      this.$emit('is-loading', false);
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
      orderedColumns: undefined,
      isLoading: false,
      searchByIdValue: undefined,
      rows: [],
      page: 1,
      pageLimit: 20,
      orderBy: {
        key: 'ID',
        direction: 'DESC',
      },
      showExtraCells: false,
    };
  },
};
</script>

<style scoped></style>
