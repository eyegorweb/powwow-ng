<template>
  <div>
    <div class="row">
      <div class="col-md-9"></div>
      <div class="col-md-3">
        <permission domain="party" action="create_customer_account">
          <UiButton variant="accent" block class="float-right" @click="createCustomerAccount()">
            {{ $t('getadmin.partnerDetail.addCustomerAccount') }}
          </UiButton>
        </permission>
      </div>
    </div>

    <div class="mt-4">
      <TableWithFilter
        v-if="filters"
        :filters="filters"
        :columns="columns"
        :rows="rows"
        :total="total"
        :order-by.sync="defaultOrderBy"
        :is-loading="isLoading"
        @applyFilters="applyFilters"
      />
    </div>
  </div>
</template>

<script>
import BillAccountStatusCell from './BillAccountStatusCell';
import UiButton from '@/components/ui/Button';
import TableWithFilter from '@/components/Filters/TableWithFilter';
import TextFilter from '@/components/Filters/TextFilter.vue';
import { fetchAllCustomerAccounts } from '@/api/customerAccounts';

export default {
  components: {
    UiButton,
    TableWithFilter,
  },
  props: {
    partner: {
      type: Object,
    },
  },

  data() {
    return {
      filters: [
        {
          title: 'getadmin.cf.label',
          component: TextFilter,
          onChange(chosenValue) {
            return {
              id: 'getadmin.cf.label',
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
      ],
      rows: [],
      total: 0,
      account: undefined,
      isLoading: false,

      defaultOrderBy: {
        key: 'code',
        direction: 'DESC',
      },
      columns: [
        {
          id: 1,
          label: this.$t('common.code'),
          name: 'code',
          orderable: true,
          visible: true,
          format: {
            type: 'LinkBtn',
            onClick: async (code) => {
              this.$router.push({
                name: 'getAdminPartnerDetails.billingAccounts.form',
                params: { id: this.$route.params.id, customerAccountCode: code },
              });
            },
          },
        },
        {
          id: 2,
          label: this.$t('col.label'),
          name: 'name',
          orderable: true,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('col.company'),
          name: 'company',
          orderable: true,
          visible: true,
        },
        {
          id: 4,
          label: this.$t('col.status'),
          name: 'status',
          orderable: true,
          visible: true,
          format: {
            component: BillAccountStatusCell,
          },
        },
        {
          id: 5,
          label: this.$t('col.creationDate'),
          name: 'auditable',
          orderable: true,
          visible: true,
          format: { type: 'ObjectAttribute', path: 'created' },
        },
      ],
    };
  },

  mounted() {
    this.applyFilters();
  },

  methods: {
    async applyFilters(payload) {
      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 20 },
        filters: [],
      };

      this.isLoading = true;
      const allFilters = [
        {
          id: 'partner.id',
          value: this.partner.id,
        },
        ...filters,
      ];

      const data = await fetchAllCustomerAccounts(allFilters, pagination, this.defaultOrderBy);
      this.isLoading = false;
      this.total = data.total;
      this.rows = data.items;
    },
    createCustomerAccount() {
      this.$router.push({
        name: 'getAdminPartnerDetails.billingAccounts.form',
        params: { id: this.$route.params.id, customerAccountCode: undefined },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
