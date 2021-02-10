<template>
  <div class="row">
    <div class="col-md-3">
      <ul class="list-group">
        <li class="list-group-item">
          <a
            href="#"
            @click.prevent="
              $router.push({
                name: 'getAdminPartnerDetails.customerList.list',
                params: { id: $route.params.id },
              })
            "
          >
            &lt; {{ $t('back') }}</a
          >
        </li>
      </ul>
      <br />
      <TabsSubMenu v-if="menuItems" :menu-items="menuItems" />
    </div>
    <div class="col-md-9">
      <router-view
        :partner="partner"
        :billing-account-to-detail="billingAccountToDetail"
      ></router-view>
    </div>
  </div>
</template>

<script>
import TabsSubMenu from '@/components/TabsSubMenu.vue';
import CommercialOffers from './CommercialOffers/index.vue';
import DeliveryAdresses from './DeliveryAdresses';
import SimCards from '@/views/GetAdmin/PartnerDetail/OffersTab/SimCards.vue';
import { getCustomerAccount } from '@/api/partners.js';

export default {
  components: {
    TabsSubMenu,
    DeliveryAdresses,
    CommercialOffers,
    SimCards,
  },
  props: {
    partner: Object,
  },

  async mounted() {
    const menuItems = [
      {
        title: 'getadmin.partnerDetail.mb.commercialOffer',
        to: {
          name: 'getAdminPartnerDetails.customerList.detail.commercialOffers.list',
          params: {
            id: this.$route.params.id,
            billingAccountCode: this.$route.params.billingAccountCode,
          },
        },
      },
      {
        title: 'getadmin.partnerDetail.mb.simCards',
        to: {
          name: 'getAdminPartnerDetails.customerList.detail.simcards',
          params: {
            id: this.$route.params.id,
            billingAccountCode: this.$route.params.billingAccountCode,
          },
        },
      },
      {
        title: 'getadmin.partnerDetail.mb.deliveryAdresses',
        to: {
          name: 'getAdminPartnerDetails.customerList.detail.deliveryAdresses',
          params: {
            id: this.$route.params.id,
            billingAccountCode: this.$route.params.billingAccountCode,
          },
        },
      },
    ];

    if (this.$shouldShowMocks) {
      /*
      menuItems.push(
        'getadmin.partnerDetail.mb.customerDescription',
        'getadmin.partnerDetail.mb.clientContactDescription'
      );
      //*/
    }
    this.menuItems = menuItems;

    if (this.$route.params.billingAccountCode) {
      const response = await getCustomerAccount(this.$route.params.billingAccountCode);
      if (response.items && response.items.length) {
        this.billingAccountToDetail = response.items[0];
      }
    }
  },

  data() {
    return {
      billingAccountToDetail: undefined,
      menuItems: undefined,
    };
  },
};
</script>

<style lang="scss" scoped></style>
