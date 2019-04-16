<template>
  <LoaderContainer :is-loading="false">
    <div>
      <div class="row mb-3">
        <div class="col">
          <h2 class="text-gray font-weight-light" style="font-size: 2rem">
            {{ $t('getparc.actLines.total', { total: total }) }}
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
          <SearchByLinesId @searchById="searchById" />
        </template>
      </DataTable>
    </div>
  </LoaderContainer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DataTable from '@/components/DataTable/DataTable';
import LoaderContainer from '@/components/LoaderContainer';
import SearchByLinesId from '@/views/GetParc/ActLines/SearchByLinesId';

function setFormatComponentsToColumns(columns) {
  return columns.reduce((preparedColumns, col) => {
    const formatted = { ...col };
    preparedColumns.push(formatted);
    return preparedColumns;
  }, []);
}

export default {
  components: {
    DataTable,
    LoaderContainer,
    SearchByLinesId,
  },
  async mounted() {
    this.columns = setFormatComponentsToColumns([...this.commonColumns]);
    console.log('mocked datas', this.rows);
  },
  data() {
    return {
      total: 1,
      columns: [],
      commonColumns: [
        {
          id: 1,
          label: this.$t('col.partner'),
          name: 'partner',
          orderable: true,
          visible: true,
        },
        {
          id: 2,
          label: this.$t('getparc.actDetail.col.iccid'),
          name: 'iccid',
          orderable: true,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('getparc.actDetail.col.msisdn'),
          name: 'msisdn',
          orderable: true,
          visible: true,
        },
        {
          id: 4,
          label: this.$t('getparc.actDetail.col.imsi'),
          name: 'imsi',
          orderable: true,
          visible: true,
        },
        {
          id: 5,
          label: this.$t('getparc.actLines.col.simStatus'),
          name: 'simStatus',
          orderable: true,
          visible: true,
        },
        {
          id: 6,
          label: this.$t('filters.lines.statusDate'),
          name: 'statusDate',
          orderable: true,
          visible: true,
        },
        {
          id: 7,
          label: this.$t('col.offer'),
          name: 'offer',
          orderable: true,
          visible: true,
        },
        {
          id: 8,
          label: this.$t('getparc.actLines.col.lastPLMN'),
          name: 'lastPLMN',
          orderable: true,
          visible: true,
        },
        {
          id: 9,
          label: this.$t('common.customFields'),
          name: 'customFields',
          orderable: true,
          visible: true,
        },
        {
          id: 10,
          label: this.$t('getparc.actLines.col.msisdnA'),
          name: 'msisdnA',
          orderable: true,
          visible: true,
        },
        {
          id: 11,
          label: this.$t('getparc.actLines.col.manufacturer'),
          name: 'manufacturer',
          orderable: true,
          visible: true,
        },
        {
          id: 12,
          label: this.$t('getparc.actLines.col.deviceReference'),
          name: 'deviceReference',
          orderable: true,
          visible: true,
        },
      ],
      // rows: [
      //   {
      //     partner: 'Toto',
      //     action: 'Pré-activation',
      //     actDate: '01/11/2018',
      //     details: 'Partner toto',
      //     target: 6,
      //     success: 0,
      //     ongoing: 0,
      //     fail: 0,
      //   },
      // ],
      page: 0,
      pageLimit: 20,
      orderBy: {
        key: 'id',
        direction: 'DESCENDING',
      },
      showExtraCells: false,
    };
  },
  computed: {
    ...mapGetters('actLines', ['linesActionsResponse', 'appliedFilters']),
    rows() {
      return this.linesActionsResponse ? this.linesActionsResponse : [];
    },
    // TODO: fetch custom fields for the column 'custom fields' of the data table (inspiré de GetSimOrderDetails)
    // customFields() {
    //   const customFields = this.getFromOrder('customFields');
    //   if (!customFields) return [];
    //   let customFieldsArray = [];
    //   for (let i = 1; i <= 6; i++) {
    //     const value = customFields['custom' + i];
    //     const label = this.order.party[`custom${i}FieldLabel`];
    //     if (value) {
    //       customFieldsArray.push({
    //         index: i,
    //         value,
    //         label,
    //       });
    //     }
    //   }
    //   return customFieldsArray;
    // },
  },
  methods: {
    ...mapActions('actLines', ['fetchLinesActionsFromApi']),
    changeCellsOrder(orderedCells) {
      const notVisibleCells = this.columns.filter(c => !c.visible);
      this.columns = orderedCells.concat(notVisibleCells);
    },
    searchById(params) {
      console.log('search by id: ', params);
    },
    async fetchLinesActions() {
      this.fetchLinesActionsFromApi({
        orderBy: this.orderBy,
        pageInfo: {
          // pas de pagination
          page: this.page,
          limit: this.pageLimit,
        },
        appliedFilters: this.appliedFilters,
      });
    },
  },
  watch: {
    orderBy() {
      this.page = 1;
      this.fetchLinesActions();
    },
    pageLimit() {
      this.page = 1;
      this.fetchLinesActions();
    },
    appliedFilters() {
      this.fetchLinesActions();
    },
    // isPanelOpen() {
    //   if (this.isPanelOpen) {
    //     this.showExtraCells = false;
    //   }
    // },
  },
};
</script>

<style scoped>
</style>
