<template>
  <LoaderContainer :is-loading="false">
    <div>
      <div class="row mb-3">
        <div class="col">
          <h2 class="text-gray font-weight-light" style="font-size: 2rem">
            {{ $t('getparc.history.total', { total: total }) }}
          </h2>
        </div>
        <div class="col">
          <ExportButton :export-fn="getExportFn()" :columns="columns" :order-by="getPageInfo">
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
        <template slot="actions" slot-scope="{ row }">
          <HistoryActions :item="row" />
        </template>
      </DataTable>
    </div>
  </LoaderContainer>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import DataTable from '@/components/DataTable/DataTable';
import LoaderContainer from '@/components/LoaderContainer';
import HistoryActions from './HistoryActions';
import IdCell from './IdCell';
import DetailsCell from './DetailsCell';
import SearchByActId from '@/views/GetParc/SearchByActId';
import ExportButton from '@/components/ExportButton';
import { exportAllMassActions } from '@/api/massActions';

const cellComponents = {
  IdCell,
  DetailsCell,
};

function setFormatComponentsToColumns(columns) {
  return columns.reduce((preparedColumns, col) => {
    const formatted = { ...col };
    if (col.format && col.format.componentId) {
      formatted.format.component = cellComponents[col.format.componentId];
    }
    preparedColumns.push(formatted);
    return preparedColumns;
  }, []);
}

/**
 * assigne le bon composant de céllule
 */
function loadColumnsFromLocalStorage() {
  const strColumns = localStorage.getItem('getparc.actHistory.savedColumns');
  if (!strColumns) return;
  const columns = JSON.parse(strColumns);
  return setFormatComponentsToColumns(columns);
}

function saveColumnsToLocalStorage(columns) {
  const savableColumns = JSON.parse(JSON.stringify(columns));
  localStorage.setItem('getparc.actHistory.savedColumns', JSON.stringify(savableColumns));
}

/**
 * après chaque modification dans la structure des colonnes, il faudra modifier la constante VERSION pour supprimer la configuration utilisateur du local storage
 */
const VERSION = '8';
function checkConfigVersion() {
  const savedVersion = localStorage.getItem('tables.version');
  if (savedVersion !== VERSION) {
    localStorage.removeItem('getparc.actHistory.savedColumns');
    localStorage.setItem('tables.version', VERSION);
  }
}

export default {
  components: {
    DataTable,
    LoaderContainer,
    HistoryActions,
    // SearchByIdInput,
    SearchByActId,
    ExportButton,
  },
  async mounted() {
    checkConfigVersion();
    const savedColumns = loadColumnsFromLocalStorage();
    if (savedColumns) {
      this.columns = savedColumns;
    } else {
      this.columns = setFormatComponentsToColumns([...this.commonColumns]);
    }
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
      this.fetchMassActions();
    },
    isPanelOpen() {
      if (this.isPanelOpen) {
        this.showExtraCells = false;
      }
    },
    columns(newValues) {
      saveColumnsToLocalStorage(newValues);
    },
  },
  data() {
    return {
      columns: [],
      commonColumns: [
        {
          id: 1,
          label: this.$t('col.id'),
          name: 'id',
          orderable: true,
          visible: true,
          format: {
            componentId: 'IdCell',
          },
        },
        {
          id: 2,
          label: this.$t('getparc.history.col.action'),
          name: 'actionType',
          orderable: true,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('getparc.history.col.actDate'),
          name: 'dueDate',
          orderable: true,
          visible: true,
        },
        {
          id: 4,
          label: this.$t('getparc.history.col.details'),
          name: 'actionType',
          orderable: true,
          visible: true,
          format: {
            componentId: 'DetailsCell',
          },
        },
        {
          id: 5,
          label: this.$t('getparc.history.col.target'),
          name: 'targetActionNumber',
          orderable: true,
          visible: true,
        },
        {
          id: 6,
          label: this.$t('getparc.history.col.success'),
          name: 'completedActionNumber',
          orderable: true,
          visible: true,
        },
        {
          id: 7,
          label: this.$t('getparc.history.col.ongoing'),
          name: 'inProgressActionNumber',
          orderable: true,
          visible: true,
        },
        {
          id: 8,
          label: this.$t('getparc.history.col.fail'),
          name: 'errorActionNumber',
          orderable: true,
          visible: false,
        },
        // colonnes cachées par défaut
        {
          id: 9,
          label: this.$t('getparc.history.col.created'),
          name: 'created',
          orderable: true,
          visible: false,
        },
        {
          id: 10,
          label: this.$t('getparc.history.col.endDate'),
          name: 'endDate',
          orderable: true,
          visible: false,
        },
        {
          id: 11,
          label: this.$t('getparc.history.col.partyId'),
          name: 'party',
          orderable: true,
          sortingName: 'partyName',
          visible: false,
          format: {
            type: 'ObjectAttribute',
            path: 'name',
          },
        },
        {
          id: 12,
          label: this.$t('getparc.history.col.creator'),
          name: 'creator',
          orderable: true,
          visible: false,
        },
        {
          id: 13,
          label: this.$t('getparc.history.col.status'),
          name: 'status',
          orderable: true,
          visible: false,
        },
      ],
      pageLimit: 20,
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      showExtraCells: false,
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
          value: 'massActionID',
          label: this.$t('getparc.search.act-mass-id'),
        },
        {
          code: 'c6',
          value: 'unitActionId',
          label: this.$t('getparc.search.act-unit-id'),
        },
      ],
    };
  },
  methods: {
    ...mapActions('actHistory', ['fetchActionsFromApi']),
    ...mapMutations('actHistory', ['setPage', 'forceAppliedFilters']),
    changeCellsOrder(orderedCells) {
      const notVisibleCells = this.columns.filter(c => !c.visible);
      this.columns = orderedCells.concat(notVisibleCells);
    },
    async searchById(params) {
      this.forceAppliedFilters([
        {
          id: params.id,
          value: params.value,
        },
      ]);
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
        return response.map(i => {
          const tempObject = {
            user: i.user,
            party: i.party,
            fromParty: i.fromParty,
            toParty: i.toParty,
          };
          return Object.assign({}, i.massActionResponse, tempObject);
        });
      }
    },
    getExportFn() {
      return async (columnsParam, pagination, exportFormat) => {
        return await exportAllMassActions(
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
          ],
          this.getPageInfo,
          exportFormat
        );
      };
    },
  },
  computed: {
    ...mapGetters('actHistory', ['massActionsResponse', 'appliedFilters', 'actHistoryPage']),
    rows() {
      return this.massActionsResponse ? this.formatResponse(this.massActionsResponse.items) : [];
    },
    total() {
      return this.massActionsResponse ? this.massActionsResponse.total : 0;
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
