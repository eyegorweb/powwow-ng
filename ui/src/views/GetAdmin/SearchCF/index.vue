<template>
  <div class="mt-4">
    <div class="row mb-5">
      <div class="col-md-9">
        <h4>
          <b>GetAdmin</b>
          - {{ $t('getadmin.cf.name') }}
        </h4>
      </div>

    </div>
    <TableWithFilter
      v-if="filters"
      :filters="filters"
      :columns="columns"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :show-reset="!!searchByNbValue"
      :is-loading="isLoading"
      @resetSearch="resetFilters"
      @applyFilters="applyFilters"
      @columnOrdered="orderedColumns = $event"
    >
      <div slot="title">{{ $t('getadmin.cf.total', { total: total }) }}</div>

      <div slot="topLeft">
        <SearchByNb
          @searchByNb="searchByNb"
          @inputIsEmpty="clearSearch"
          :init-value="searchByNbValue"
        />
        </div>
    </TableWithFilter>
  </div>
</template>

<script>
import Tooltip from '@/components/ui/Tooltip';
import SearchByNb from './filters/SearchByNb';
import TableWithFilter from '@/components/Filters/TableWithFilter';
import TextFilter from '@/components/Filters/TextFilter.vue';
import PartnerFilter from '@/components/Filters/filterbar/PartnerFilter';
import { fetchAllCustomerAccounts } from '@/api/customerAccounts';
import get from 'lodash.get';
import { mapGetters, mapMutations } from 'vuex';
import CodeCell from './CodeCell.vue';

export default {
  components: {
    Tooltip,
    TableWithFilter,
    SearchByNb,
    CodeCell,
  },
  data() {
    return {
      lastPayload: undefined,
      isLoading: true,
      orderedColumns: undefined,
      searchByNbValue: undefined,

      // Définition des colonnes de la table
      columns: [
        {
          id: 1,
          label: 'Code',
          name: 'code',
          label: this.$t('getadmin.cf.code'),
          orderable: true,
          visible: true,
          noHandle: false,

          format: {
            component: CodeCell,
          },
        },
        {
          id: 2,
          label: 'Name',
          name: 'name',
          label: this.$t('getadmin.cf.label'),
          orderable: true,
          visible: true,
          noHandle: true,
        },
        {
          id: 3,
          label: 'MarketLine',
          name: 'marketLine',
          label: this.$t('getadmin.cf.marketLine'),
          orderable: true,
          visible: true,
          noHandle: true,
        },
        {
          id: 4,
          label: 'Siret',
          name: 'siret',
          orderable: true,
          visible: true,
          noHandle: true,
        },
        {
          id: 5,
          label: 'Status',
          name: 'status',
          label: this.$t('common.lastName'),
          orderable: true,
          visible: true,
          noHandle: true,
        },
        {
          id: 6,
          label: 'Created',
          name: 'auditable',
          label: this.$t('common.lastName'),
          orderable: true,
          visible: true,
          noHandle: true,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'created');
            },
          },
        },
      ],
      orderBy: {
        key: 'code',
        direction: 'ASC',
      },
      rows: [],
      total: 0,
      filters: undefined,
      searchByLoginValue: undefined,
      searchLoginResults: [],
      currentAppliedFilters: [],
    };
  },
  mounted() {

    // Définition des filtres
    let currentVisibleFilters = [
      {
        title: this.$t('getadmin.cf.label'),
        component: TextFilter,
        onChange(chosenValue) {
          return {
            id: 'getadmin.cf.filters.name',
            value: chosenValue,
          };
        },
      },
      {
        title: this.$t('getadmin.cf.marketLine'),
        component: TextFilter,
        onChange(chosenValue) {
          return {
            id: 'getadmin.cf.filters.marketLine',
            value: chosenValue,
          };
        },
      },
      {
        title: 'Siren',
        component: TextFilter,
        onChange(chosenValue) {
          return {
            id: 'getadmin.cf.filters.siren',
            value: chosenValue,
          };
        },
      },
      {
        title: 'Siret',
        component: TextFilter,
        onChange(chosenValue) {
          return {
            id: 'getadmin.cf.filters.siret',
            value: chosenValue,
          };
        },
      },
    ];
    this.filters = currentVisibleFilters;
    this.applyFilters();
  },
  methods: {

    // Recherche des CF en appliquant les filtres
    async applyFilters(payload) {

      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 20 },
        filters: [],
      };

      this.isLoading = true;
      const data = await fetchAllCustomerAccounts(filters, pagination);
      this.isLoading = false;
      this.total = data.total;
      this.rows = data.items;

      this.currentAppliedFilters = filters;
    },

    // Recherche par n° de compte de facturation
    async searchByNb(value) {
      this.searchByNbValue = value;

      const data = await fetchAllCustomerAccounts([{
        id: 'getadmin.cf.filters.code',
        value
      }], { page: 0, limit: 20 });
      this.total = data.total;
      this.rows = data.items;
    },

    // Remise à 0 de la recherche unitaire
    clearSearch() {
      if (this.searchByNbValue) {
        this.searchByNbValue = undefined;
        this.applyFilters();
      }
    },

    resetFilters() {
      this.searchByNbValue = undefined;
      this.applyFilters();
    },
  },
};
</script>

<style lang="scss" scoped></style>
