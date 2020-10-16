<template>
  <div class="row">
    <div class="col-md-3">
      <ul class="list-group">
        <li class="list-group-item">
          <a href="#" @click.prevent="$emit('back')"> &lt; {{ $t('back') }}</a>
        </li>
      </ul>
      <br />
      <TabsSubMenu v-if="menuItems" :menu-items="menuItems" v-model="section" />
    </div>
    <div class="col-md-9">
      <CommercialOffers
        v-if="section === 'getadmin.partnerDetail.mb.commercialOffer'"
        :partner="partner"
        :billing-account-to-detail="billingAccountToDetail"
      />
      <DeliveryAdresses
        v-if="section === 'getadmin.partnerDetail.mb.deliveryAdresses'"
        :partner="partner"
        :billing-account-to-detail="billingAccountToDetail"
      />
      <SimCards
        v-if="section === 'getadmin.partnerDetail.mb.simCards'"
        :partner="partner"
        :billing-account-to-detail="billingAccountToDetail"
      />
    </div>
  </div>
</template>

<script>
import TabsSubMenu from '@/components/TabsSubMenu.vue';
import CommercialOffers from './CommercialOffers/index.vue';
import DeliveryAdresses from './DeliveryAdresses';
import SimCards from '@/views/GetAdmin/PartnerDetail/OffersTab/SimCards.vue';

export default {
  components: {
    TabsSubMenu,
    DeliveryAdresses,
    CommercialOffers,
    SimCards,
  },
  props: {
    billingAccountToDetail: Object,
    partner: Object,
  },

  mounted() {
    const menuItems = [
      'getadmin.partnerDetail.mb.commercialOffer',
      'getadmin.partnerDetail.mb.simCards',
      'getadmin.partnerDetail.mb.deliveryAdresses',
    ];

    if (this.$shouldShowMocks) {
      menuItems.push(
        'getadmin.partnerDetail.mb.customerDescription',
        'getadmin.partnerDetail.mb.clientContactDescription'
      );
    }
    this.menuItems = menuItems;
  },

  data() {
    return {
      section: 'getadmin.partnerDetail.mb.commercialOffer',

      menuItems: undefined,
    };
  },
};
</script>

<style lang="scss" scoped></style>
