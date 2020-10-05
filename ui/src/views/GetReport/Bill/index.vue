<template>
  <div class="mt-4">
    <div class="row mb-5">
      <div class="col-md-9">
        <h4>
          <b>GetReport</b>
          - {{ $t('menu.reportsBill') }}
        </h4>
      </div>
    </div>
    <TableWithFilter
      v-if="columns && filters"
      :filters="filters"
      :columns="columns"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :size="0"
      :show-reset="!!searchByRefValue"
      @resetSearch="resetFilters"
      @applyFilters="applyFilters"
      no-pagination
      :is-table-visible-fn="isTableVisible"
      :default-values="defaultValues"
    >
      <div slot="title" class="total">{{ $t('bills.total', { total: rows.length }) }}</div>
      <div slot="topLeft">
        <SearchByReference
          @search="doSearchByRef"
          @inputIsEmpty="clearSearch"
          :init-value="searchByRefValue"
        />
      </div>
      <div slot="onTableNotVisible">
        <div class="alert alert-warning" role="alert">{{ $t('chooseOnePartner') }}</div>
      </div>
    </TableWithFilter>
  </div>
</template>

<script>
import TableWithFilter from '@/components/Filters/TableWithFilter';
import BillsPartnerFilter from './filters/BillsPartnerFilter';
// import PartnerNameFilter from '@/views/GetAdmin/SearchUsers/filters/PartnerFilter.vue';
import { fetchBills } from '@/api/bills';
import DateBills from './filters/DateBills';
import BillsAccounts from './filters/BillsAccounts.vue';
import SearchByReference from './filters/SearchByReference';
import { mapGetters, mapMutations } from 'vuex';
import { formatCurrency } from '@/utils/numbers.js';

export default {
  components: {
    TableWithFilter,
    SearchByReference,
  },

  data() {
    return {
      searchByRefValue: undefined,
      lastFilters: [],
      columns: [
        {
          id: 1,
          label: this.$t('col.billsReference'),
          name: 'reference',
          orderable: false,
          noHandle: true,
          visible: true,
          format: {
            type: 'OpenPanel',
            getConfig: row => this.getPanelConfig(row),
          },
        },
        {
          id: 1,
          label: this.$t('date'),
          name: 'date',
          orderable: false,
          visible: true,
        },
        {
          id: 2,
          label: this.$t('menu.account'),
          name: 'customerAccountCode',
          orderable: false,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('col.amountHT'),
          name: 'amountExclTaxes',
          orderable: false,
          visible: true,
          format: {
            type: 'Getter',
            getter: row => {
              return `${formatCurrency(row.amountExclTaxes)} €`;
            },
          },
        },
        {
          id: 4,
          label: this.$t('col.amountTTC'),
          name: 'amount',
          orderable: false,
          visible: true,
          format: {
            type: 'Getter',
            getter: row => {
              return `${formatCurrency(row.amount)} €`;
            },
          },
        },
      ],
      filters: undefined,
      rows: [],
      total: 0,
      orderBy: {},
      defaultValues: [],
    };
  },
  methods: {
    ...mapMutations(['openPanel']),

    isTableVisible(appliedFilters) {
      return appliedFilters && appliedFilters.find(f => f.id === 'getadmin.users.filters.partners');
    },

    resetFilters() {
      this.searchByRefValue = undefined;
      this.applyFilters();
    },

    getPanelConfig(row) {
      const doReset = () => {
        this.searchByRefValue = undefined;
        this.applyFilters();
      };
      return {
        title: this.$t('bills.detailPanel', { reference: row.reference }),
        panelId: 'bills.detailPanel',
        width: '55%',
        backdrop: true,
        ignoreClickAway: true,
        payload: { ...row, selectedPartnerId: this.selectedPartnerId },
        onClosePanel(params) {
          if (params && params.resetSearch) {
            doReset();
          }
        },
      };
    },
    clearSearch() {
      if (this.searchByRefValue) {
        this.searchByRefValue = undefined;
        this.applyFilters();
      }
    },

    async doSearchByRef(value) {
      this.searchByRefValue = value;
      this.applyFilters({
        filters: [
          {
            id: 'reference',
            value,
          },
          // Le partenaire est obligatoirement set au lancement de cette method
          {
            id: 'getadmin.users.filters.partners',
            data: {
              id: this.selectedPartnerId,
            },
          },
        ],
      });
    },

    async applyFilters(payload) {
      const { filters } = payload || {
        filters: [],
      };
      this.lastFilters = filters;

      const data = await fetchBills(filters);
      this.total = data.total;
      this.rows = data.items || [];
    },
  },
  computed: {
    ...mapGetters(['userIsPartner', 'singlePartner']),
    selectedPartnerId() {
      if (!this.lastFilters) return;
      return this.lastFilters.find(f => f.id == 'getadmin.users.filters.partners').data.id;
    },
  },
  mounted() {
    const commonFilters = [
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
        title: 'common.period',
        component: DateBills,
        onChange(values) {
          return {
            id: 'common.period',
            startDate: values.startDate,
            endDate: values.endDate,
          };
        },
      },
    ];

    let partnerFilter = [];

    if (!this.userIsPartner) {
      partnerFilter = [
        {
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
        },
      ];
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

    this.filters = [...partnerFilter, ...commonFilters];
    this.applyFilters();
  },
};
</script>

<style lang="scss" scoped>
.card {
  top: 70px;
}

.btn-select {
  user-select: initial;
}
</style>

<style lang="scss">
.btn-link {
  user-select: initial;
}
</style>
