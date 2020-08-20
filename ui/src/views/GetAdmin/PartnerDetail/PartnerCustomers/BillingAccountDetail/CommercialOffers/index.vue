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
import { fetchCommercialOffersForPartnerId } from '@/api/offers';
import get from 'lodash.get';

export default {
  components: {
    PaginatedDataTable,
    UiButton,
    CommercialOfferForm,
  },
  props: {
    partner: Object,
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
            onClick: row => {
              console.log('data -> row', row);
            },
            // getter: row => {
            //   console.log('data -> row', row);
            //   return get(row, 'marketingOffer.code');
            // },
          },
        },
        {
          id: 2,
          label: this.$t('getadmin.partnerDetail.mb.commercialOffers.name'),
          name: 'description',
          orderable: true,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('getadmin.partnerDetail.mb.commercialOffers.cfCode'),
          name: 'code',
          orderable: true,
          visible: true,
          format: {
            type: 'Getter',
            getter: row => {
              console.log('data -> row', row);
              return get(row, 'customerAccount.code');
            },
          },
        },
        {
          id: 4,
          label: this.$t('getadmin.partnerDetail.created'),
          name: 'created',
          orderable: true,
          visible: true,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'auditable.created');
            },
          },
        },
        {
          id: 5,
          label: this.$t('getadmin.partnerDetail.mb.commercialOffers.edited'),
          name: 'updated',
          orderable: true,
          visible: true,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'auditable.updated');
            },
          },
        },
      ],
    };
  },

  methods: {
    createCommercialOffer() {
      this.showForm = true;
    },
    getFetchFn() {
      return async () => {
        const partnerId = this.partner.id ? this.partner.id : '';
        // const customerAccountId = this.partner.id ? this.partner.id : ''; // l'id du CF normalement et pas du partenaire...
        const response = await fetchCommercialOffersForPartnerId(partnerId);
        return {
          rows: response.items,
          total: response.total,
        };
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
