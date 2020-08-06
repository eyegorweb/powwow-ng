<template>
  <div>
    <template v-if="!showForm">
      <h4 class="text-primary text-uppercase">Offres Commerciales</h4>

      <PaginatedDataTable
        v-if="columns"
        :columns="columns"
        :order="defaultOrderBy"
        :fetch-data-fn="getFetchFn()"
      />

      <div class="row mb-3 mt-3">
        <div class="col-md-12">
          <UiButton variant="secondary" class="float-right" @click="createCommercialOffer()">
            {{ $t('getadmin.partnerDetail.mb.commercialOffers.create') }}
          </UiButton>
        </div>
      </div>
    </template>
    <CommercialOfferForm v-else @back="showForm = false" />
  </div>
</template>

<script>
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable.vue';
import UiButton from '@/components/ui/Button';
import CommercialOfferForm from './CommercialOfferForm';

export default {
  components: {
    PaginatedDataTable,
    UiButton,
    CommercialOfferForm,
  },
  data() {
    return {
      showForm: false,
      defaultOrderBy: {
        key: 'code',
        direction: 'DESC',
      },
      columns: [
        {
          id: 1,
          label: this.$t('getadmin.partnerDetail.mb.commercialOffers.code'),
          name: 'code',
          orderable: true,
          visible: true,
          format: {
            type: 'LinkBtn',
            onClick: async (code, row) => {
              console.log('data -> code, row', code, row);
            },
          },
        },
        {
          id: 2,
          label: this.$t('getadmin.partnerDetail.mb.commercialOffers.name'),
          name: 'name',
          orderable: true,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('getadmin.partnerDetail.mb.commercialOffers.cfCode'),
          name: 'cf',
          orderable: true,
          visible: true,
        },
        {
          id: 4,
          label: this.$t('getadmin.partnerDetail.created'),
          name: 'created',
          orderable: true,
          visible: true,
        },
        {
          id: 5,
          label: this.$t('getadmin.partnerDetail.mb.commercialOffers.edited'),
          name: 'edited',
          orderable: true,
          visible: true,
        },
      ],
    };
  },

  methods: {
    createCommercialOffer() {
      this.showForm = true;
    },
    getFetchFn() {
      return async (pageInfo, orderInfo) => {
        console.log('getFetchFn -> pageInfo, orderInfo', pageInfo, orderInfo);
        return {
          rows: [
            {
              code: 'AZE123',
              name: 'Name 1',
            },
          ],
          total: 1,
        };
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
