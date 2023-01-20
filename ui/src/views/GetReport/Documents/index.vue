<template>
  <div class="mt-4">
    <div class="row mb-5">
      <div class="col-md-9">
        <h4>
          <b>GetReport</b>
          - {{ $t('menu.documents') }}
        </h4>
      </div>
    </div>
    <TableWithFilter
      v-if="filters"
      :filters="filters"
      :default-values="defaultValues"
      :columns="columns"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :is-loading="isLoading"
      @applyFilters="applyFilters"
    >
      <div slot="title" class="total">
        {{ $t('documents.total', { total: $formatLargeNumber(total) }) }}
      </div>
      <template slot="actions" slot-scope="{ row }">
        <Actions :row="row" @deleteDocument="onDeleteDcument(row)" />
      </template>
    </TableWithFilter>
  </div>
</template>

<script>
import TableWithFilter from '@/components/Filters/TableWithFilter';
import { fetchAllDocuments, deleteDocument } from '@/api/documents';
import { fetchReports } from '@/api/reports.js';
import BillsPartnerFilter from '@/views/GetReport/Bill/filters/BillsPartnerFilter';
import BillsAccounts from '@/views/GetReport/Bill/filters/BillsAccounts.vue';
import DocumentNameFilter from './filters/DocumentNameFilter';
import DocumentCategoryFilter from './filters/DocumentCategoryFilter';
import Actions from './Actions';
import ReportModelFilter from './filters/ReportModelFilter';
import get from 'lodash.get';
import moment from 'moment';

import { mapGetters } from 'vuex';

export default {
  components: {
    TableWithFilter,
    Actions,
  },

  mounted() {
    this.columns = [
      {
        id: 1,
        label: this.$t('documents.name'),
        name: 'documentName',
        sortingName: 'documentName',
        orderable: true,
        visible: true,
      },
      {
        id: 2,
        label: this.$t('documents.partner'),
        name: 'party',
        format: {
          type: 'Getter',
          getter: (row) => {
            return get(row, 'party.name', '-');
          },
        },
        orderable: false,
        visible: true,
      },
      {
        id: 3,
        label: this.$t('documents.creationDate'),
        name: 'creationDate',
        orderable: true,
        visible: true,
        format: {
          type: 'Getter',
          getter: (row) => {
            const created = moment(row.created, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm');
            return created || '-';
          },
        },
      },
      {
        id: 4,
        label: this.$t('documents.category'),
        name: 'category',
        format: {
          type: 'Getter',
          getter: (row) => {
            const translateKey = 'documents.categories.' + get(row, 'category.name');
            const translated = this.$t(translateKey);
            if (translateKey !== translated) {
              return translated;
            } else {
              return get(row, 'category.name');
            }
          },
        },
        orderable: false,
        visible: true,
      },
      {
        id: 5,
        label: this.$t('documents.model'),
        name: 'report.name',
        format: {
          type: 'Getter',
          getter: (row) => {
            return get(row, 'report.name', '-');
          },
        },
        orderable: false,
        visible: false,
      },
      {
        id: 6,
        label: this.$t('col.creator'),
        name: 'report.auditable',
        format: {
          type: 'Getter',
          getter: (row) => {
            return (
              get(row, 'auditable.creator.name.firstName', '-') +
              ' ' +
              get(row, 'auditable.creator.name.lastName', '-')
            );
          },
        },
        orderable: false,
        visible: true,
      },
      {
        id: 7,
        label: this.$t('col.billingAccount'),
        name: 'billingAccount',
        format: {
          type: 'Getter',
          getter: (row) => {
            return get(row, 'customerAccount.code', '-');
          },
        },
        orderable: false,
        visible: true,
      },
    ];
    const reportId = get(this.$route, 'params.reportId');

    const filters = [];

    if (!this.userIsPartner) {
      filters.push({
        title: 'getadmin.users.filters.partners',
        component: BillsPartnerFilter,
        onChange(chosenValue, clearFilter) {
          clearFilter('filters.billingAccounts');
          return {
            id: 'getadmin.users.filters.partners',
            value: chosenValue ? chosenValue.label : '',
            data: chosenValue,
          };
        },
        onRemove(clearFilter) {
          clearFilter('filters.billingAccounts');
        },
      });
    } else {
      this.defaultValues = [
        {
          id: 'getadmin.users.filters.partners',
          value: this.singlePartner ? this.singlePartner.name : '',
          data: this.singlePartner,
          hidden: true,
        },
      ];
    }

    filters.push(
      {
        title: 'filters.billingAccounts',
        component: BillsAccounts,
        onChange(chosenValue) {
          return {
            id: 'filters.billingAccounts',
            value: chosenValue ? chosenValue.label : '',
            data: chosenValue,
          };
        },
      },
      {
        title: 'documents.name',
        component: DocumentNameFilter,
        id: 2,
        onChange(value) {
          return {
            id: 'documents.name',
            value,
          };
        },
      },
      {
        title: 'documents.category',
        component: DocumentCategoryFilter,
        id: 3,
        onChange(chosenValues) {
          return {
            id: 'documents.category',
            values: chosenValues,
          };
        },
      }
    );

    if (this.havePermission('getReport', 'read')) {
      filters.push({
        title: 'documents.model',
        component: ReportModelFilter,
        id: 4,
        onChange(selectedValue) {
          return {
            id: 'documents.model',
            value: selectedValue.label,
            data: selectedValue,
          };
        },

        // TODO: Refactor
        initialize: async (currentFilters) => {
          if (!reportId) return;
          const pagination = { page: 0, limit: 999 };
          const orderBy = {
            key: 'id',
            direction: 'DESC',
          };

          const response = await fetchReports(
            orderBy,
            pagination,
            this.singlePartner ? this.singlePartner.id : undefined
          );

          if (response.items) {
            const selectedItem = response.items.find((i) => i.id === reportId);
            currentFilters.push({
              id: 'documents.model',
              value: selectedItem.name,
              data: selectedItem,
            });
          }
        },
      });
    }

    this.filters = filters;
    this.applyFilters();
  },
  data() {
    return {
      filters: undefined,
      columns: undefined,
      defaultValues: [],
      rows: [],
      total: 0,
      orderBy: {
        key: 'creationDate',
        direction: 'DESC',
      },
      isLoading: true,
    };
  },
  computed: {
    ...mapGetters(['userIsBO', 'userIsPartner', 'singlePartner', 'havePermission']),
  },
  methods: {
    async applyFilters(payload) {
      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 20 },
        filters: [],
      };
      this.isLoading = true;
      const data = await fetchAllDocuments(this.orderBy, pagination, filters);
      this.isLoading = false;

      this.total = data.total;
      this.rows = data.items;
    },
    refreshAllDocuments(index) {
      if (index >= 0) {
        return this.rows.splice(index, 1);
      }
    },
    async onDeleteDcument(document) {
      await deleteDocument(document.id);
      const currentIndex = this.rows.findIndex((r) => r.id === document.id);
      this.refreshAllDocuments(currentIndex);
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  top: 70px;
}
</style>
