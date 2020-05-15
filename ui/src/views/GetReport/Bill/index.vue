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
      v-if="columns"
      :filters="filters"
      :columns="columns"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :size="0"
      @applyFilters="applyFilters"
      no-pagination
    >
      <div slot="title" class="total">{{ $t('bills.total', { total: rows.length }) }}</div>
      <div slot="topLeft">
        <SearchByReference
          @search="doSearchByRef"
          @inputIsEmpty="clearSearch"
          :init-value="searchByRefValue"
        />
      </div>
    </TableWithFilter>
  </div>
</template>

<script>
import TableWithFilter from '@/components/Filters/TableWithFilter';
import PartnerNameFilter from './filters/BillsPartnerFilter';
// import PartnerNameFilter from '@/views/GetAdmin/SearchUsers/filters/PartnerFilter.vue';
import { fetchBills } from '@/api/bills';
import DateBills from './filters/DateBills';
import BillsAccounts from './filters/BillsAccounts.vue';
import SearchByReference from './filters/SearchByReference';

export default {
  components: {
    TableWithFilter,
    SearchByReference,
  },

  data() {
    return {
      searchByRefValue: undefined,
      columns: undefined,
      filters: [
        {
          title: 'getadmin.users.filters.partners',
          component: PartnerNameFilter,
          onChange(chosenValue) {
            return {
              id: 'getadmin.users.filters.partners',
              value: chosenValue ? chosenValue.label : '',
              data: chosenValue,
            };
          },
        },
        {
          title: 'filters.billingAccounts',
          component: BillsAccounts,

          onChange(chosenValue) {
            return {
              id: 'filters.billingAccounts',
              value: chosenValue ? chosenValue.name : '',
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
      ],
      rows: [],
      total: 0,
      orderBy: {},
    };
  },
  methods: {
    clearSearch() {
      if (this.searchByRefValue) {
        this.searchByRefValue = undefined;
        this.applyFilters();
      }
    },

    async doSearchByRef(value) {
      this.searchByRefValue = value;
      console.log('value >>', value);
      this.applyFilters([
        {
          id: 'reference',
          value,
        },
      ]);
    },

    async applyFilters(payload) {
      const { filters } = payload || {
        filters: [],
      };

      const data = await fetchBills(filters);
      this.total = data.total;
      this.rows = data.items || [];
    },
  },
  mounted() {
    this.columns = [
      {
        id: 1,
        label: this.$t('col.billsReference'),
        name: 'reference',
        orderable: true,
        noHandle: true,
        visible: true,
      },
      {
        id: 1,
        label: this.$t('date'),
        name: 'date',
        orderable: true,
        visible: true,
      },
      {
        id: 2,
        label: this.$t('menu.account'),
        name: 'customerAccountCode',
        orderable: true,
        visible: true,
      },
      {
        id: 3,
        label: this.$t('col.amountHT'),
        name: 'amountExclTaxes',
        orderable: true,
        visible: true,
      },
      {
        id: 4,
        label: this.$t('col.amountTTC'),
        name: 'amount',
        orderable: true,
        visible: true,
      },
      {
        id: 5,
        visible: true,
        noHandle: true,
      },
    ];

    this.applyFilters();
  },
};
</script>

<style lang="scss" scoped>
.card {
  top: 70px;
}
</style>
