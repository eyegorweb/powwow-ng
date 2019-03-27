<template>
  <LoaderContainer :is-loading="false">
    <div>
      <div class="row mb-3">
        <div class="col">
          <h2 class="text-gray font-weight-light" style="font-size: 2rem">
            {{ $t('getparc.history.total', { total: total }) }}
          </h2>
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
          <SearchByIdInput></SearchByIdInput>
        </template>
        <template slot="actions" slot-scope="{ row }">
          <HistoryActions :item="row" />
        </template>
      </DataTable>
    </div>
  </LoaderContainer>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import LoaderContainer from '@/components/LoaderContainer';
import HistoryActions from './HistoryActions';
import IdCell from './IdCell';
import SearchByIdInput from './SearchByIdInput';

// import { mapGetters, mapActions, mapMutations } from 'vuex';

const cellComponents = {
  IdCell,
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

export default {
  components: {
    DataTable,
    LoaderContainer,
    HistoryActions,
    SearchByIdInput,
  },
  async mounted() {
    const savedColumns = loadColumnsFromLocalStorage();
    if (savedColumns) {
      this.columns = savedColumns;
    } else {
      this.columns = setFormatComponentsToColumns([...this.commonColumns]);
    }
  },

  watch: {
    columns(newValues) {
      saveColumnsToLocalStorage(newValues);
    },
  },

  data() {
    return {
      total: 1,
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
          name: 'action',
          orderable: true,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('getparc.history.col.actDate'),
          name: 'actDate',
          orderable: true,
          visible: true,
        },
        {
          id: 4,
          label: this.$t('getparc.history.col.details'),
          name: 'details',
          orderable: true,
          visible: true,
        },
        {
          id: 5,
          label: this.$t('getparc.history.col.target'),
          name: 'target',
          orderable: true,
          visible: true,
        },
        {
          id: 6,
          label: this.$t('getparc.history.col.success'),
          name: 'success',
          orderable: true,
          visible: true,
        },
        {
          id: 7,
          label: this.$t('getparc.history.col.ongoing'),
          name: 'ongoing',
          orderable: true,
          visible: false,
        },
        {
          id: 8,
          label: this.$t('getparc.history.col.fail'),
          name: 'fail.history',
          orderable: true,
          visible: false,
        },
      ],
      rows: [
        {
          id: '260114',
          action: 'Pré-activation',
          actDate: '01/11/2018',
          details: 'Offre: SCHINDLER_40MO_30MIN',
          target: 6,
          success: 0,
          ongoing: 0,
          fail: 0,
        },
      ],
      page: 0,
      pageLimit: 20,
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      showExtraCells: false,
    };
  },
  methods: {
    changeCellsOrder(orderedCells) {
      const notVisibleCells = this.columns.filter(c => !c.visible);
      this.columns = orderedCells.concat(notVisibleCells);
    },
  },
};
</script>

<style scoped></style>
