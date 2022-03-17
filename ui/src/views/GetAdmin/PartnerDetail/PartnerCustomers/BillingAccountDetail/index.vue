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
import { getCustomerAccounts } from '@/api/partners.js';

export default {
  components: {
    TabsSubMenu,
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
          meta:{label: 'Détail du partenaire - CF - Liste des offres commerciales (MB)'},
          params: {
            id: this.$route.params.id,
            billingAccountId: this.$route.params.billingAccountId,
          },
        },
      },
      {
        title: 'getadmin.partnerDetail.mb.simCards',
        to: {
          name: 'getAdminPartnerDetails.customerList.detail.simcards',
          meta:{label: 'Détail du partenaire - CF - Cartes SIM (MB)'},
          params: {
            id: this.$route.params.id,
            billingAccountId: this.$route.params.billingAccountId,
          },
        },
      },
      {
        title: 'getadmin.partnerDetail.mb.deliveryAdresses',
        to: {
          name: 'getAdminPartnerDetails.customerList.detail.deliveryAdresses',
          meta:{label: 'Détail du partenaire - CF - Adresse de livraison (MB)'},
          params: {
            id: this.$route.params.id,
            billingAccountId: this.$route.params.billingAccountId,
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

    if (this.$route.params.billingAccountId) {
      const items = await getCustomerAccounts({
        id: { in: [parseInt(this.$route.params.billingAccountId)] },
      });
      if (items && items.length) {
        this.billingAccountToDetail = items[0];
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
