<template>
  <LoaderContainer :is-loading="false">
    <div>
      <Title num="2" title="getparc.actLines.step1Title" />
      <div class="row mb-3">
        <div class="col">
          <h4 class="text-gray font-weight-light" style="font-size: 1.3rem">
            {{ $t('getparc.actLines.total', { total: total }) }}
          </h4>
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
import CheckBoxCell from './CheckBoxCell';
import DataTable from '@/components/DataTable/DataTable';
import LoaderContainer from '@/components/LoaderContainer';
import SearchByLinesId from '@/views/GetParc/ActLines/SearchByLinesId';
import Title from '../Title';

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
    Title,
  },
  async mounted() {
    this.columns = setFormatComponentsToColumns([...this.commonColumns]);
  },
  data() {
    return {
      columns: [],
      commonColumns: [
        {
          id: 99,
          label: '',
          name: 'partner',
          orderable: false,
          visible: true,
          noHandle: true,
          format: {
            component: CheckBoxCell,
          },
        },
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
          visible: false,
        },
        {
          id: 8,
          label: this.$t('getparc.actLines.col.lastPLMN'),
          name: 'lastPLMN',
          orderable: true,
          visible: false,
        },
        {
          id: 9,
          label: this.$t('common.customFields'),
          name: 'customFields',
          orderable: true,
          visible: false,
        },
        {
          id: 10,
          label: this.$t('getparc.actLines.col.msisdnA'),
          name: 'msisdnA',
          orderable: true,
          visible: false,
        },
        {
          id: 11,
          label: this.$t('getparc.actLines.col.manufacturer'),
          name: 'manufacturer',
          orderable: true,
          visible: false,
        },
        {
          id: 12,
          label: this.$t('getparc.actLines.col.deviceReference'),
          name: 'deviceReference',
          orderable: true,
          visible: false,
        },
      ],
      page: 0,
      pageLimit: 20,
      // orderBy: {
      //   key: 'ASC',
      //   direction: 'DESC',
      // },
      orderBy: {},
      showExtraCells: false,
    };
  },
  computed: {
    ...mapGetters('actLines', ['linesActionsResponse', 'appliedFilters']),

    total() {
      return this.linesActionsResponse ? this.linesActionsResponse.total : 0;
    },
    rows() {
      return this.linesActionsResponse ? this.linesActionsResponse.items : [];
    },
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
  },
};
</script>

<style lang="scss" scoped>
.step-title {
  text-transform: uppercase;
  color: $primary;
  span {
    font-size: 1rem;
  }

  h4 {
    position: relative;
    font-size: 1rem;
  }

  h4 span.text {
    background-color: $light-gray;
    color: $secondary;
    font-weight: 640;
    font-size: 1rem;
    padding-left: 10px;
    padding-right: 10px;
  }

  h4:after {
    content: '';
    position: absolute;
    bottom: 0.5rem;
    left: 0;
    right: 0;
    height: 0.5em;
    border-top: 1px solid $medium-gray;
    z-index: -1;
  }
}
</style>
