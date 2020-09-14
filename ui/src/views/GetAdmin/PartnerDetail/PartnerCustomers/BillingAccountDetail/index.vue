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
    </div>
  </div>
</template>

<script>
import TabsSubMenu from '@/components/TabsSubMenu.vue';
import CommercialOffers from './CommercialOffers/index.vue';

export default {
  props: {
    billingAccountToDetail: Object,
    partner: Object,
  },

  components: {
    TabsSubMenu,

    CommercialOffers,
  },

  mounted() {
    const menuItems = ['getadmin.partnerDetail.mb.commercialOffer'];

    if (this.$shouldShowMocks) {
      menuItems.push(
        'getadmin.partnerDetail.mb.offerAndProduct',
        'getadmin.partnerDetail.mb.customerDescription',
        'getadmin.partnerDetail.mb.clientContactDescription',
        'getadmin.partnerDetail.mb.deliveryAdresses',
        'getadmin.partnerDetail.mb.paymentMethod'
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
