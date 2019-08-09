<template>
  <LoaderContainer :is-loading="isLoading">
    <div>
      <div class="row mb-3">
        <div class="col">
          <h2 class="text-gray font-weight-light" style="font-size: 2rem">
            {{ $t('getparc.actLines.total', { total: total }) }}
          </h2>
        </div>
        <div class="col">
          <ExportButton :export-fn="getExportFn()" :columns="columns" :order-by="orderBy">
            <span slot="title">{{
              $t('getparc.history.details.EXPORT_LINES', { total: total })
            }}</span>
          </ExportButton>
        </div>
      </div>
      <DataTable
        storage-id="getparc.lines"
        storage-version="009"
        :columns="columns"
        :rows="rows || []"
        :page.sync="page"
        :page-limit.sync="pageLimit"
        :total="total || 0"
        :order-by.sync="orderBy"
        :show-extra-columns.sync="showExtraCells"
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
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
import CheckBoxCell from './CheckBoxCell';
import DataTable from '@/components/DataTable/DataTable';
import LoaderContainer from '@/components/LoaderContainer';
import SearchByLinesId from '@/views/GetParc/ActLines/SearchByLinesId';
// import Title from '../Title';
import SimStatusCell from './SimStatusCell';
import IdCell from './IdCell';
import LinkTo from './LinkTo';
import DateStatus from '@/views/GetParc/ActDetail/DateStatus';
import ExportButton from '@/components/ExportButton';
import { exportSimCardInstances } from '@/api/linesActions';

export default {
  components: {
    DataTable,
    LoaderContainer,
    SearchByLinesId,
    ExportButton,
  },

  props: {
    creationMode: Boolean,
  },
  data() {
    return {
      columns: [
        {
          id: 99,
          label: '',
          name: 'partner',
          orderable: false,
          visible: true,
          noHandle: true,
          notConfigurable: true,
          format: {
            component: CheckBoxCell,
          },
          visibleWhen: () => {
            return this.creationMode;
          },
        },
        {
          id: 2,
          label: this.$t('getparc.actDetail.col.iccid'),
          orderable: true,
          visible: true,
          name: 'iccid',
          exportId: 'LINE_ICCID',
          format: {
            component: IdCell,
          },
        },
        {
          id: 1,
          label: this.$t('col.partner'),
          orderable: true,
          sortingName: 'partyName',
          visible: true,
          name: 'party',
          exportId: 'PARTY_ID',
          format: {
            type: 'ObjectAttribute',
            path: 'name',
          },
        },
        {
          id: 3,
          label: this.$t('getparc.actDetail.col.msisdn'),
          name: 'accessPoint',
          exportId: 'LINE_MSISDN',
          format: {
            component: LinkTo,
          },
          orderable: false,
          sortingName: 'msisdn',
          visible: true,
        },
        {
          id: 4,
          label: this.$t('getparc.actDetail.col.imsi'),
          name: 'accessPoint',
          exportId: 'LINE_IMSI',
          format: {
            type: 'ObjectAttribute',
            path: 'lines[0].imsi',
          },
          orderable: false,
          sortingName: 'imsi',
          visible: true,
        },
        {
          id: 5,
          label: this.$t('getparc.actLines.col.simStatus'),
          orderable: true,
          sortingName: 'simStatus',
          visible: true,
          name: 'accessPoint',
          exportId: 'LINE_SIM_STATUS',
          format: {
            component: SimStatusCell,
          },
        },
        {
          id: 6,
          label: this.$t('filters.lines.statusDate'),
          name: 'accessPoint',
          orderable: false,
          visible: true,
          exportId: 'LINE_SIM_STATUS_DATE',
          format: {
            component: DateStatus,
          },
        },
        {
          id: 7,
          label: this.$t('col.offer'),
          name: 'accessPoint',
          exportId: 'LINE_OFFER',
          format: {
            type: 'ObjectAttribute',
            path: 'offer.marketingOffer.description',
          },
          orderable: false,
          visible: false,
        },
        {
          id: 8,
          label: this.$t('getparc.actLines.col.lastPLMN'),
          name: 'lastPLMN',
          orderable: false,
          visible: false,
        },
        {
          id: 10,
          label: this.$t('getparc.actLines.col.msisdnA'),
          name: 'msisdnA',
          exportId: 'LINE_AMSISDN',
          orderable: false,
          visible: false,
        },
        {
          id: 11,
          label: this.$t('getparc.actLines.col.manufacturer'),
          name: 'deviceInstance',
          exportId: 'LINE_MANUFACTURER',
          format: {
            type: 'ObjectAttribute',
            path: 'manufacturer',
          },
          orderable: true,
          sortingName: 'manufacturer',
          visible: false,
        },
        {
          id: 12,
          label: this.$t('getparc.actLines.col.deviceReference'),
          name: 'deviceInstance',
          exportId: 'LINE_DEVICE_REFERENCE',
          format: {
            type: 'ObjectAttribute',
            path: 'deviceReference',
          },
          orderable: true,
          sortingName: 'deviceReference',
          visible: false,
        },
      ],
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      showExtraCells: false,
    };
  },
  computed: {
    ...mapGetters('actLines', ['linesActionsResponse', 'appliedFilters', 'linePage', 'isLoading']),
    ...mapState('actLines', ['limitPerPage']),

    pageLimit: {
      get() {
        return this.limitPerPage;
      },
      set(value) {
        this.setPageLimit(value);
      },
    },

    total() {
      return this.linesActionsResponse ? this.linesActionsResponse.total : 0;
    },
    rows() {
      return this.linesActionsResponse ? this.linesActionsResponse.items : [];
    },
    page: {
      get() {
        return this.linePage || 0;
      },
      set(newVal) {
        this.setPage(newVal);
      },
    },
    getPageInfo() {
      return { page: this.page - 1, limit: this.pageLimit };
    },
  },
  methods: {
    ...mapActions('actLines', ['fetchLinesActionsFromApi']),
    ...mapMutations('actLines', ['setPage', 'forceAppliedFilters', 'setPageLimit']),

    searchById(params) {
      this.forceAppliedFilters([
        {
          id: params.id,
          value: params.value,
        },
      ]);
    },
    async fetchLinesActions() {
      this.fetchLinesActionsFromApi({
        orderBy: this.orderBy,
        pageInfo: this.getPageInfo,
        appliedFilters: this.appliedFilters,
      });
    },

    getExportFn() {
      return async (columns, orderBy, exportFormat) => {
        return await exportSimCardInstances(columns, orderBy, exportFormat, this.appliedFilters);
      };
    },
  },
  watch: {
    rows(items) {
      this.$emit('noResults', items.length === 0);
    },
    linePage() {
      this.fetchLinesActions();
    },
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
