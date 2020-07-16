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
      v-if="columns && filters"
      :filters="filters"
      :default-values="defaultValues"
      :columns="columns"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :size="8"
      @applyFilters="applyFilters"
    >
      <div slot="title" class="total">{{ $t('documents.total', { total: total }) }}</div>
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
import PartnerNameFilter from '@/views/GetAdmin/SearchUsers/filters/PartnerFilter.vue';
import DocumentNameFilter from './filters/DocumentNameFilter';
import DocumentCategoryFilter from './filters/DocumentCategoryFilter';
import Actions from './Actions';
import ReportModelFilter from './filters/ReportModelFilter';
import get from 'lodash.get';

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
          getter: row => {
            return get(row, 'party.name', '-');
          },
        },
        orderable: true,
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
          getter: row => {
            return get(row, 'auditable.created', '-');
          },
        },
      },
      {
        id: 4,
        label: this.$t('documents.category'),
        name: 'category',
        format: {
          type: 'Getter',
          getter: row => {
            return this.$t('documents.categories.' + get(row, 'category.name', '-'));
          },
        },
        orderable: true,
        visible: true,
      },
      // {
      //   id: 5,
      //   label: this.$t('documents.model'),
      //   name: 'partyGroups',
      //   orderable: true,
      //   visible: true,
      // },
    ];
    const reportId = get(this.$route, 'params.reportId');

    const filters = [];

    if (!this.userIsPartner) {
      filters.push({
        title: 'getadmin.users.filters.partners',
        component: PartnerNameFilter,
        onChange(chosenValues) {
          return {
            id: 'getadmin.users.filters.partners',
            values: chosenValues,
          };
        },
      });
    } else {
      this.defaultValues = [
        {
          id: 'getadmin.users.filters.partners',
          values: [
            {
              ...this.singlePartner,
              label: this.singlePartner.name,
            },
          ],
          hidden: true,
        },
      ];
    }

    filters.push(
      {
        title: 'documents.name',
        component: DocumentNameFilter,
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
        onChange(chosenValues) {
          return {
            id: 'documents.category',
            values: chosenValues,
          };
        },
      },
      {
        title: 'documents.model',
        component: ReportModelFilter,
        onChange(selectedValue) {
          return {
            id: 'documents.model',
            value: selectedValue.label,
            data: selectedValue,
          };
        },

        // TODO: Refactor
        initialize: async currentFilters => {
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
            const selectedItem = response.items.find(i => i.id === reportId);
            currentFilters.push({
              id: 'documents.model',
              value: selectedItem.name,
              data: selectedItem,
            });
          }
        },
      }
    );

    this.filters = filters;
    this.applyFilters();
  },
  data() {
    return {
      filters: undefined,
      columns: undefined,
      rows: [],
      total: 0,
      orderBy: {
        key: 'creationDate',
        direction: 'DESC',
      },
    };
  },
  computed: {
    ...mapGetters(['userIsBO', 'userIsPartner', 'singlePartner']),
  },
  methods: {
    async applyFilters(payload) {
      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 30 },
        filters: [],
      };

      const data = await fetchAllDocuments(this.orderBy, pagination, filters);
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
      const currentIndex = this.rows.findIndex(r => r.id === document.id);
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
