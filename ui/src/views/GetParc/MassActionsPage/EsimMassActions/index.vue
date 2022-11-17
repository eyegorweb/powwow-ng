<template>
  <div>
    <TableWithFilter
      v-if="columns && defaultValues"
      storage-id="actHistory.esim"
      storage-version="001"
      :filters="filters"
      :columns="columns"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :is-table-loading="isLoading"
      :show-reset="!!searchByIdValue"
      :default-values="defaultValues"
      :is-search-disabled="noDatesInFilters"
      @applyFilters="applyFilters"
      @columnOrdered="orderedColumns = $event"
      @currentFiltersChange="currentFilters = $event"
    >
      <template #beforeSelectedFilters>
        <div class="alert alert-warning" role="alert" v-if="noDatesInFilters">
          {{ $t('common.noDateChosenError') }}
        </div>
      </template>
      <div slot="title">
        <h2 class="text-gray font-weight-light" style="font-size: 2rem">
          <template v-if="!apiError">
            {{ $t('getparc.history.total', { total: formattedTotal }) }}
          </template>
          <template v-else>
            {{ $t('searchError') }}
          </template>
        </h2>
      </div>
      <div slot="topRight">
        <ExportButton
          :export-fn="getExportFn()"
          :columns="orderedColumns"
          :order-by="orderBy"
          export-all
          force-async-export
        >
          <span slot="title">{{
            $t('getparc.history.details.EXPORT_ACTS', { total: formattedTotal })
          }}</span>
        </ExportButton>
      </div>

      <div slot="topLeft">
        <SearchByLinesId @searchById="searchById" :init-value="searchByIdValue" />
      </div>
    </TableWithFilter>
  </div>
</template>

<script>
import TableWithFilter from '@/components/Filters/TableWithFilter';
import SearchByLinesId from '@/components/SearchById';
import ExportButton from '@/components/ExportButton';
import PartnerFilter from '@/components/Filters/filterbar/PartnerFilter';
import RangeAndSingleDate from '@/components/Filters/filterbar/RangeAndSingleDate.vue';
import { currentDateMinusMounts } from '@/utils/date';

import { formatLargeNumber } from '@/utils/numbers';
import { searchMassActions, exportMassActionsOnly, exporAlltMassActions } from '@/api/massActions';

import IdCell from '@/views/GetParc/LineDetail/DetailsTab/ActsHistory/IdCell.vue';
import ActionCell from '@/views/GetParc/MassActionsPage/HistoryTable/ActionCell.vue';
import DetailsCell from '@/views/GetParc/MassActionsPage/HistoryTable/DetailsCell.vue';
import RateCell from '@/views/GetParc/MassActionsPage/HistoryTable/RateCell.vue';
import CreatorCell from '@/views/GetParc/MassActionsPage/HistoryTable/CreatorCell.vue';
import UsersMultiSelectFilter from '@/components/Filters/filterbar/UsersMultiSelectFilter.vue';
import ManagementActTypesFilter from '@/views/GetParc/MassActionsPage/filters/ManagementActTypesFilter.vue';
// import ManagementActionServices from '@/views/GetParc/MassActionsPage/filters/ManagementActionServices.vue';

import ManagementActStatusFilter from '@/views/GetParc/MassActionsPage/filters/ManagementActStatusFilter.vue';
import ActLinesErrorFilter from '@/views/GetParc/MassActionsPage/filters/ActLinesErrorFilter.vue';

export default {
  components: {
    TableWithFilter,
    SearchByLinesId,
    ExportButton,
  },
  data() {
    return {
      apiError: false,
      columns: undefined,
      filters: undefined,
      rows: [],
      total: 0,
      orderBy: {
        key: 'ID',
        direction: 'ASC',
      },
      isLoading: false,
      searchByIdValue: undefined,
      orderedColumns: undefined,
      currentFilters: undefined,
      lastPayload: undefined,
      defaultValues: undefined,
    };
  },
  async mounted() {
    this.initFilters();
    await this.initColumns();

    const startDate = currentDateMinusMounts(3);
    const dateFilter = {
      id: 'filters.actDateStart',
      startDate,
    };
    const categoryFilter = {
      id: 'filters.category',
      value: 'ESIM',
      hidden: true,
    };
    this.defaultValues = [dateFilter, categoryFilter];

    this.applyFilters();
  },
  computed: {
    formattedTotal() {
      return formatLargeNumber(this.total);
    },
    noDatesInFilters() {
      if (this.currentFilters && this.currentFilters.length) {
        const dateFilters = [
          'filters.actDateStart',
          'filters.actDateCreation',
          'filters.actDateEnd',
        ];
        return !this.currentFilters.filter((f) => dateFilters.indexOf(f.id) > -1).length;
      }
      return true;
    },
    currentPartners() {
      if (!this.currentFilters) return [];

      const foundFilter = this.currentFilters.find((f) => f.id === 'filters.partners');
      if (foundFilter && foundFilter.values && foundFilter.values.length) {
        return foundFilter.values;
      }

      return [];
    },
  },
  methods: {
    getExportFn() {
      return async (columnsParam, pagination, exportFormat, asyncExportRequest, exportAll) => {
        // si CUSTOM_SUCCESS_ERROR est présente alors il mettre à la place les 2 params  COMPLETED et FAILED
        let columnsToUse = [...columnsParam];

        const customSuccessErrorIndex = columnsParam.findIndex((c) => c === 'CUSTOM_SUCCESS_ERROR');

        if (customSuccessErrorIndex > -1) {
          columnsToUse.splice(customSuccessErrorIndex, 1, 'COMPLETED', 'FAILED');
        }

        if (exportAll) {
          return exporAlltMassActions(
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
          return exportMassActionsOnly(
            [...columnsToUse, 'STARTED'],
            exportFormat,
            this.appliedFilters,
            asyncExportRequest,
            this.total
          );
        }
      };
    },
    async initColumns() {
      this.columns = [
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
      ];
    },
    initFilters() {
      this.filters = [
        {
          title: 'filters.partners',
          component: PartnerFilter,
          id: 1,
          onChange(chosenValues) {
            return {
              id: 'filters.partners',
              values: chosenValues,
            };
          },
        },
        {
          title: 'filters.userCreator',
          component: UsersMultiSelectFilter,
          id: 2,
          getPageContext: () => {
            return { partners: this.currentPartners };
          },
          onChange(chosenValues) {
            return {
              id: 'filters.userCreator',
              values: chosenValues,
            };
          },
        },
        {
          title: 'filters.actDateCreation',
          component: RangeAndSingleDate,
          id: 3,
          onChange(chosenValues) {
            return {
              id: 'filters.actDateCreation',
              ...chosenValues,
            };
          },
        },
        {
          title: 'filters.actTypes',
          component: ManagementActTypesFilter,
          id: 4,
          onChange(chosenValues) {
            return {
              id: 'filters.actTypes',
              values: chosenValues,
            };
          },
        },
        {
          title: 'filters.actDateStart',
          component: RangeAndSingleDate,
          id: 5,
          onChange(chosenValues) {
            return {
              id: 'filters.actDateStart',
              ...chosenValues,
            };
          },
        },
        {
          title: 'filters.actDateEnd',
          component: RangeAndSingleDate,
          id: 6,
          onChange(chosenValues) {
            return {
              id: 'filters.actDateEnd',
              ...chosenValues,
            };
          },
        },
        /*
        {
          title: 'filters.services',
          component: ManagementActionServices,
          onChange(chosenValues) {
            return {
              id: 'filters.services',
              values: chosenValues,
            };
          },
        },
        //*/

        {
          title: 'filters.actStatus',
          component: ManagementActStatusFilter,
          id: 7,
          onChange(chosenValues) {
            return {
              id: 'filters.actStatus',
              values: chosenValues,
            };
          },
        },
        {
          title: 'filters.lines.error',
          component: ActLinesErrorFilter,
          id: 8,
          onChange(chosenValues) {
            return {
              id: 'filters.lines.error',
              values: chosenValues,
            };
          },
        },
      ];
    },
    formatResponse(response) {
      if (response) {
        return response.map((i) => ({ ...i, ...i.massAction }));
      }
    },
    async applyFilters(payload) {
      this.lastPayload = payload;

      const { pagination, filters, orderBy } = payload || {
        pagination: { page: 0, limit: 20 },
        filters: this.defaultValues,
      };

      this.isLoading = true;
      this.apiError = false;
      try {
        const data = await searchMassActions(orderBy, pagination, filters);
        this.isLoading = false;

        if (data) {
          this.rows = this.formatResponse(data.items);
          this.total = data.total;
          this.currentAppliedFilters = filters;
        }
      } catch (e) {
        console.log(e);
        this.isLoading = false;
        this.apiError = true;
      }
    },
    searchById(params) {
      this.searchByIdValue = params.value;
      // TODO: API call to search by id
    },
  },
};
</script>

<style lang="scss" scoped></style>
