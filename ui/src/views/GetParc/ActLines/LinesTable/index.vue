<template>
  <LoaderContainer :is-loading="isLoading">
    <div slot="on-loading">
      <SearchResultSkeleton :columns="columns" />
    </div>
    <div>
      <template v-if="!showInfoMessage">
        <div class="row mb-3">
          <div class="col">
            <h2 class="text-gray font-weight-light" style="font-size: 2rem;">
              <slot name="title">
                <template>
                  {{
                    $t('getparc.actLines.total', {
                      total: formattedTotal,
                    })
                  }}
                </template>
              </slot>
            </h2>
          </div>
          <div class="col" v-if="hasResults">
            <ExportButton
              export-all
              :export-fn="getExportFn()"
              :columns="orderedColumns"
              :order-by="orderBy"
            >
              <span slot="title">
                {{ $t('getparc.history.details.EXPORT_LINES', { total: formattedTotal }) }}
              </span>
            </ExportButton>
          </div>
        </div>
        <template v-if="hasResults">
          <DataTable
            v-if="columns"
            storage-id="getparc.lines"
            storage-version="004"
            :columns="columns"
            :rows="rows || []"
            :page.sync="page"
            :page-limit.sync="pageLimit"
            :total="total || 0"
            :order-by.sync="orderBy"
            :show-extra-columns.sync="showExtraCells"
            :size="7"
            @columnOrdered="orderedColumns = $event"
          >
            <template slot="topLeftCorner">
              <SearchByLinesId @searchById="searchById" :init-value="searchByIdValue" />
            </template>
          </DataTable>
        </template>
        <template v-else>
          <div v-if="searchByIdValue">
            <button class="btn btn-link" @click="resetFilters">{{ $t('resetFilters') }}</button>
          </div>
          <div class="alert alert-light">{{ $t('noResult') }}</div>
        </template>
      </template>
      <template v-else>
        <div class="row">
          <div class="col-md-8">
            <h4>Rechercher une ligne par ID</h4>
            <SearchByLinesId @searchById="searchById" :init-value="searchByIdValue" />
          </div>
        </div>

        <div class="alert alert-primary text-center mt-2" role="alert">
          Ecran de recherche de lignes et création d'actes de gestion
          <br />
          <UiButton
            variant="primary"
            class="show-all-lines flex-grow-1 py-1 px-3 ml- mt-3"
            @click="fetchLinesActions()"
            >Afficher toutes les lignes</UiButton
          >
        </div>
      </template>
    </div>
  </LoaderContainer>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
import { fetchCustomFields } from '@/api/customFields';
import CheckBoxCell from './CheckBoxCell';
import DataTable from '@/components/DataTable/DataTable';
import LoaderContainer from '@/components/LoaderContainer';
import SearchByLinesId from '@/views/GetParc/ActLines/SearchByLinesId';
// import Title from '../Title';
import IdCell from './IdCell';
// import LinkTo from './LinkTo';
import DateStatus from '@/views/GetParc/UnitActionsPage/DateStatus';
import ExportButton from '@/components/ExportButton';
import { exportSimCardInstances } from '@/api/linesActions';
import { formatLargeNumber } from '@/utils/numbers';
import get from 'lodash.get';
import UiButton from '@/components/ui/Button';
import SearchResultSkeleton from '@/components/ui/skeletons/SearchResultSkeleton';

export default {
  components: {
    DataTable,
    LoaderContainer,
    SearchByLinesId,
    ExportButton,
    SearchResultSkeleton,
    UiButton,
  },

  props: {
    creationMode: Boolean,
  },

  computed: {
    ...mapGetters('actLines', ['linesActionsResponse', 'appliedFilters', 'linePage', 'isLoading']),
    ...mapState('actLines', ['limitPerPage']),
    ...mapGetters(['userIsPartner', 'userInfos', 'userName']),

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
    formattedTotal() {
      return formatLargeNumber(this.total);
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
    msisdn() {
      return this.row.accessPoint !== null ? this.row.accessPoint.lines[0].msisdn : '';
    },
    hasResults() {
      return !!(this.rows && this.rows.length);
    },
  },
  methods: {
    ...mapActions('actLines', ['fetchLinesActionsFromApi']),
    ...mapMutations('actLines', [
      'setPage',
      'forceAppliedFilters',
      'setPageLimit',
      'startSearchingById',
    ]),

    resetFilters() {
      this.searchByIdValue = undefined;
      this.forceAppliedFilters([]);
    },

    searchById(params) {
      this.searchByIdValue = params.value;
      this.page = 1;
      this.startSearchingById([
        {
          id: params.id,
          value: params.value,
        },
      ]);
    },
    async fetchLinesActions() {
      if (!this.canSearchLines) return;

      if (this.showInfoMessage) this.showInfoMessage = false;

      this.fetchLinesActionsFromApi({
        orderBy: this.orderBy,
        pageInfo: this.getPageInfo,
        appliedFilters: this.appliedFilters,
      });
    },

    getExportFn() {
      return async (columns, orderBy, exportFormat, asyncExportRequest, exportAll) => {
        return await exportSimCardInstances(
          columns,
          orderBy,
          exportFormat,
          this.appliedFilters,
          asyncExportRequest,
          exportAll
        );
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
      this.page = 1;
      this.fetchLinesActions();
    },
  },
  async mounted() {
    if (this.userIsPartner) {
      const partnerId = get(this.userInfos, 'party.id');
      const customFields = await fetchCustomFields(partnerId);
      const partnerCustomFieldsColumns = customFields.customFields.map(c => {
        return {
          id: c.id,
          label: c.label,
          name: 'accessPoint',
          orderable: false,
          visible: false,
          // exportId: 'ORDER_STATUS',
          format: {
            type: 'ObjectAttribute',
            path: 'customFields.' + c.codeInOrder,
          },
        };
      });
      this.columns = [...this.commonColumns, ...partnerCustomFieldsColumns];
    } else {
      this.columns = [...this.commonColumns, ...this.defaultCustomFieldsColumns];
    }

    if (this.rows.length > 0) {
      this.canSearchLines = true;
      this.showInfoMessage = false;
    } else {
      setTimeout(() => {
        this.canSearchLines = true;
      });
    }
  },
  data() {
    return {
      canSearchLines: false,
      showInfoMessage: true,
      searchByIdValue: undefined,
      columns: undefined,
      orderedColumns: undefined,
      commonColumns: [
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
          noHandle: true,
          fixed: true,
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
            // component: LinkTo,
            type: 'ObjectAttribute',
            path: 'lines[0].msisdn',
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
          label: this.$t('getparc.actLines.col.lineStatus'),
          orderable: true,
          sortingName: 'simStatus',
          visible: true,
          name: 'statusTranslated',
          exportId: 'LINE_SIM_STATUS',
        },
        {
          id: 6,
          label: this.$t('filters.lines.statusDate'),
          name: 'accessPoint',
          orderable: true,
          sortingName: 'commercialStatusDate',
          visible: true,
          exportId: 'LINE_COMMERCIAL_DATE',
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
      defaultCustomFieldsColumns: [
        {
          id: 15,
          label: this.$t('col.customFields', { num: 1 }),
          name: 'customFields',
          visible: false,
          exportId: 'LINE_CUSTOM_FIELD1',
          format: {
            type: 'ObjectAttribute',
            path: 'custom1',
          },
        },
        {
          id: 16,
          label: this.$t('col.customFields', { num: 2 }),
          name: 'customFields',
          visible: false,
          exportId: 'LINE_CUSTOM_FIELD2',
          format: {
            type: 'ObjectAttribute',
            path: 'custom2',
          },
        },
        {
          id: 17,
          label: this.$t('col.customFields', { num: 3 }),
          name: 'customFields',
          visible: false,
          exportId: 'LINE_CUSTOM_FIELD3',
          format: {
            type: 'ObjectAttribute',
            path: 'custom3',
          },
        },
        {
          id: 18,
          label: this.$t('col.customFields', { num: 4 }),
          name: 'customFields',
          visible: false,
          exportId: 'LINE_CUSTOM_FIELD4',
          format: {
            type: 'ObjectAttribute',
            path: 'custom4',
          },
        },
        {
          id: 19,
          label: this.$t('col.customFields', { num: 5 }),
          name: 'customFields',
          visible: false,
          exportId: 'LINE_CUSTOM_FIELD5',
          format: {
            type: 'ObjectAttribute',
            path: 'custom5',
          },
        },
        {
          id: 20,
          label: this.$t('col.customFields', { num: 6 }),
          name: 'customFields',
          visible: false,
          exportId: 'LINE_CUSTOM_FIELD6',
          format: {
            type: 'ObjectAttribute',
            path: 'custom5',
          },
        },
      ],
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      showExtraCells: false,
    };
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
