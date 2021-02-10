<template>
  <div>
    <h4 class="text-primary text-uppercase">Offres Commerciales</h4>
    <ff-wip>
      <div class="row mb-3">
        <div class="col-md-12">
          <UiButton variant="secondary" class="float-right" @click="createCommercialOffer()">
            {{ $t('getadmin.partnerDetail.mb.commercialOffers.create') }}
          </UiButton>
        </div>
      </div>
    </ff-wip>
    <PaginatedDataTable
      v-if="columns"
      :columns="columns"
      :order="defaultOrderBy"
      :fetch-data-fn="getFetchFn()"
    />
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
    billingAccountToDetail: Object,
  },
  data() {
    return {
      // currentComOffer: undefined,
      // showForm: false,
      // disabledForm: false,
      defaultOrderBy: {
        key: 'code',
        direction: 'DESC',
      },
      columns: undefined,
    };
  },

  mounted() {
    this.columns = [
      {
        id: 1,
        label: this.$t('getadmin.partnerDetail.mb.commercialOffers.code'),
        name: 'code',
        orderable: true,
        visible: true,
        format: {
          type: 'LinkBtn',
          onClick: (code, row) => {
            // this.showForm = true;
            // this.currentComOffer = row;
            // this.disabledForm = false;
            this.$router.push({
              name: 'getAdminPartnerDetails.customerList.detail.commercialOffers.form',
              params: {
                billingAccountCode: this.$route.params.billingAccountCode,
                id: this.$route.params.id,
                comOfferId: row.id,
              },
            });
          },
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
          getter: (row) => {
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
          getter: (row) => {
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
          getter: (row) => {
            return get(row, 'auditable.updated');
          },
        },
      },
    ];
  },

  methods: {
    createCommercialOffer() {
      //this.showForm = true;
      // this.currentComOffer = undefined;
      // this.disabledForm = false;
      this.$router.push({
        name: 'getAdminPartnerDetails.customerList.detail.commercialOffers.form',
        params: {
          id: this.$route.params.id,
          billingAccountCode: this.$route.params.billingAccountCode,
        },
      });
    },
    getFetchFn() {
      return async (pageInfo) => {
        const partnerId = this.partner.id ? this.partner.id : '';
        const customerAccountId = this.billingAccountToDetail
          ? this.billingAccountToDetail.id
          : undefined; // l'id du CF normalement et pas du partenaire...
        const response = await fetchCommercialOffersForPartnerId(
          partnerId,
          customerAccountId,
          pageInfo
        );
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
