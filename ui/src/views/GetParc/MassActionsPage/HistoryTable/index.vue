<template>
  <LoaderContainer :is-loading="isLoading">
    <div slot="on-loading">
      <SearchResultSkeleton :columns="columns" />
    </div>
    <div>
      <div class="row mb-3">
        <div class="col">
          <h2 class="text-gray font-weight-light" style="font-size: 2rem">
            {{ $t('getparc.history.total', { total: formattedTotal }) }}
          </h2>
        </div>
        <div class="col" v-if="total > 0">
          <ExportButton
            :export-fn="getExportFn()"
            :columns="orderedColumns"
            :order-by="getPageInfo"
            export-all
            force-async-export
          >
            <span slot="title">{{
              $t('getparc.history.details.EXPORT_ACTS', { total: formattedTotal })
            }}</span>
          </ExportButton>
        </div>
      </div>
      <template v-if="rows && rows.length">
        <DataTable
          storage-id="getparc.actHistory"
          storage-version="008"
          :columns.sync="columns"
          :rows="rows || []"
          :page.sync="page"
          :page-limit.sync="pageLimit"
          :total="total || 0"
          :order-by.sync="orderBy"
          :show-extra-columns.sync="showExtraCells"
          :size="7"
          @colEvent="onColEvent"
          @columnOrdered="orderedColumns = $event"
        >
          <template slot="topLeftCorner">
            <SearchMassActionsById @searchById="searchById" :init-value="searchByIdValue" />
          </template>
          <template slot="actions" slot-scope="{ row }">
            <HistoryActions :item="row" @refreshSearch="onRefreshSearch" />
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
  </LoaderContainer>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import DataTable from '@/components/DataTable/DataTable';
import LoaderContainer from '@/components/LoaderContainer';
import HistoryActions from './HistoryActions';
import IdCell from './IdCell';
import ActionCell from './ActionCell';
import DetailsCell from './DetailsCell';
import SearchMassActionsById from './SearchMassActionsById';
import ExportButton from '@/components/ExportButton';
import { exportMassActionsOnly, exporAlltMassActions } from '@/api/massActions';
import { formatLargeNumber } from '@/utils/numbers';
import SearchResultSkeleton from '@/components/ui/skeletons/SearchResultSkeleton';
import RateCell from '@/views/GetParc/MassActionsPage/HistoryTable/RateCell';
import CreatorCell from './CreatorCell';

export default {
  components: {
    DataTable,
    LoaderContainer,
    HistoryActions,
    SearchMassActionsById,
    ExportButton,
    SearchResultSkeleton,
  },

  watch: {
    actHistoryPage() {
      this.fetchMassActions();
    },
    orderBy() {
      this.page = 1;
      this.fetchMassActions();
    },
    pageLimit() {
      this.page = 1;
      this.fetchMassActions();
    },
    appliedFilters() {
      this.page = 1;
      this.fetchMassActions();
    },
    isPanelOpen() {
      if (this.isPanelOpen) {
        this.showExtraCells = false;
      }
    },
  },
  data() {
    return {
      orderedColumns: undefined,
      columns: [
        {
          id: 1,
          label: this.$t('col.id'),
          name: 'id',
          sortingName: 'ID',
          orderable: true,
          visible: true,
          exportId: 'MASS_ACTION_ID',
          format: {
            component: IdCell,
          },
        },
        {
          id: 2,
          label: this.$t('getparc.history.col.action'),
          name: 'actionType',
          orderable: false,
          visible: true,
          exportId: 'ACTION_TYPE',
          format: {
            component: ActionCell,
          },
        },
        {
          id: 3,
          exportId: 'DUE_DATE',
          label: this.$t('getparc.history.col.actDate'),
          name: 'dueDate',
          orderable: false,
          visible: true,
        },
        {
          id: 4,
          exportId: 'MASS_ACTION_INFO',
          label: this.$t('getparc.history.col.details'),
          name: 'info',
          orderable: false,
          visible: true,
          format: {
            component: DetailsCell,
          },
        },
        {
          id: 5,
          exportId: 'TARGETED',
          label: this.$t('getparc.history.col.target'),
          name: 'targetActionNumber',
          sortingName: 'TARGET_ACTION_NUMBER',
          orderable: true,
          visible: true,
        },
        {
          id: 7,
          exportId: 'IN_PROGRESS',
          label: this.$t('getparc.history.col.ongoing'),
          name: 'pendingEntitiesNumber',
          sortingName: 'UNIT_ACTIONS_PENDING',
          orderable: true,
          visible: false,
        },
        {
          id: 14,
          exportId: 'CUSTOM_SUCCESS_ERROR',
          label: this.$t('getparc.history.col.rate'),
          name: 'rateActionNumber',
          sortingName: 'UNIT_ACTIONS_FAILED',
          orderable: true,
          noHandle: true,
          visible: true,
          format: {
            component: RateCell,
          },
        },

        // colonnes cachées par défaut
        {
          id: 9,
          exportId: 'CREATED',
          label: this.$t('getparc.history.col.created'),
          name: 'created',
          orderable: false,
          visible: false,
        },
        {
          id: 10,
          exportId: 'ENDED',
          label: this.$t('getparc.history.col.endDate'),
          name: 'ended',
          orderable: false,
          visible: false,
        },
        {
          id: 11,
          exportId: 'PARTNER',
          label: this.$t('getparc.history.col.partyId'),
          name: 'partyName',
          orderable: true,
          sortingName: 'PARTY',
          visible: false,
        },
        {
          id: 12,
          exportId: 'CREATOR',
          label: this.$t('getparc.history.col.creator'),
          name: 'creatorUsername',
          sortingName: 'CREATOR',
          orderable: true,
          visible: false,
          format: {
            component: CreatorCell,
          },
        },
        {
          id: 13,
          exportId: 'STATUS',
          label: this.$t('getparc.history.col.status'),
          name: 'status',
          orderable: true,
          sortingName: 'STATUS',
          visible: false,
        },
      ],
      pageLimit: 20,
      orderBy: {
        key: 'ID',
        direction: 'DESC',
      },
      showExtraCells: false,
      searchByIdValue: undefined,
    };
  },
  methods: {
    ...mapActions('actHistory', ['fetchActionsFromApi']),
    ...mapMutations('actHistory', ['setPage', 'forceAppliedFilters']),

    onColEvent(event) {
      if (event.resetSearch) {
        this.fetchMassActions();
      }
    },

    onRefreshSearch() {
      this.fetchMassActions();
    },

    async searchById(params) {
      this.searchByIdValue = params.value;
      this.forceAppliedFilters([
        {
          id: params.id,
          value: params.value,
        },
      ]);
    },
    resetFilters() {
      this.searchByIdValue = undefined;
      this.forceAppliedFilters([]);
    },
    async fetchMassActions() {
      this.fetchActionsFromApi({
        orderBy: this.orderBy,
        pageInfo: this.getPageInfo,
        appliedFilters: this.appliedFilters,
      });
    },
    // méthode pour mettre à plat la réponse renvoyée par searchMassActions
    // Pour chaque item/objet, on joue la valeur de massActionResponse pour la remonter d'un niveau et pour qu'elle se trouve à coté de "user, party, fromParty, toParty"
    formatResponse(response) {
      if (response) {
        return response.map((i) => ({ ...i, ...i.massAction }));
      }
    },
    getExportFn() {
      return async (columnsParam, pagination, exportFormat, asyncExportRequest, exportAll) => {
        // si CUSTOM_SUCCESS_ERROR est présente alors il mettre à la place les 2 params  COMPLETED et FAILED
        let columnsToUse = [...columnsParam];

        const customSuccessErrorIndex = columnsParam.findIndex((c) => c === 'CUSTOM_SUCCESS_ERROR');

        if (customSuccessErrorIndex > -1) {
          columnsToUse.splice(customSuccessErrorIndex, 1, 'COMPLETED', 'FAILED');
        }

        if (exportAll) {
          return await exporAlltMassActions(
            this.appliedFilters,
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
            ['WAITING', 'SENT', 'IN_PROGRESS', 'OK', 'KO', 'REPLAYED', 'CANCELLED'],
            'NONE',
            exportFormat,
            true
          );
        } else {
          return await exportMassActionsOnly(
            [...columnsToUse, 'STARTED'],
            exportFormat,
            this.appliedFilters,
            asyncExportRequest,
            this.total
          );
        }
      };
    },
  },
  computed: {
    ...mapGetters('actHistory', [
      'massActionsResponse',
      'appliedFilters',
      'actHistoryPage',
      'isLoading',
    ]),
    rows() {
      return this.massActionsResponse ? this.formatResponse(this.massActionsResponse.items) : [];
    },
    total() {
      return this.massActionsResponse ? this.massActionsResponse.total : 0;
    },
    formattedTotal() {
      return formatLargeNumber(this.total);
    },
    getPageInfo() {
      return { page: this.page - 1, limit: this.pageLimit };
    },
    page: {
      get() {
        return this.actHistoryPage || 0;
      },
      set(newVal) {
        this.setPage(newVal);
      },
    },
  },
};
</script>

<style scoped></style>
