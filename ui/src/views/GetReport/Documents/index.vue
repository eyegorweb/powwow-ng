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
      v-if="columns"
      :filters="filters"
      :columns="columns"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :size="0"
      @applyFilters="applyFilters"
    >
      <div slot="title" class="total">{{ $t('getadmin.users.total', { total: total }) }}</div>
    </TableWithFilter>
  </div>
</template>

<script>
import TableWithFilter from '@/components/Filters/TableWithFilter';
import { fetchAllDocuments } from '@/api/documents';
import PartnerNameFilter from '@/views/GetAdmin/SearchUsers/filters/PartnerFilter.vue';
import DocumentNameFilter from './filters/DocumentNameFilter';
import DocumentCategoryFilter from './filters/DocumentCategoryFilter';

import { mapGetters } from 'vuex';

export default {
  components: {
    TableWithFilter,
  },

  mounted() {
    this.columns = [
      {
        id: 1,
        label: this.$t('documents.name'),
        name: 'documentName',
        orderable: true,
        visible: true,
      },
      {
        id: 2,
        label: this.$t('documents.partner'),
        name: 'party.name',
        orderable: true,
        visible: true,
      },
      {
        id: 3,
        label: this.$t('documents.creationDate'),
        name: 'creationDate',
        orderable: true,
        visible: true,
      },
      {
        id: 4,
        label: this.$t('documents.category'),
        name: 'category',
        format: {
          type: 'Getter',
          getter: row => {
            return row.category.name;
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
    this.applyFilters();
  },
  data() {
    return {
      filters: [
        {
          title: 'getadmin.users.filters.partners',
          component: PartnerNameFilter,
          onChange(chosenValues) {
            return {
              id: 'getadmin.users.filters.partners',
              values: chosenValues,
            };
          },
        },
        {
          title: 'documents.name',
          component: DocumentNameFilter,
          onChange(chosenValue) {
            return {
              id: 'documents.name',
              value: chosenValue.label,
              data: chosenValue,
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
      ],
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
    ...mapGetters(['userIsBO']),
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
  },
};
</script>

<style lang="scss" scoped>
.card {
  top: 70px;
}
</style>
