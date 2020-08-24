<template>
  <div class="row">
    <div class="col-md-3">
      <ul class="list-group">
        <li class="list-group-item">
          <a href="#" @click.prevent="$emit('back')"> &lt; {{ $t('back') }}</a>
        </li>
      </ul>
      <br />
      <TabsSubMenu :menu-items="menuItems" v-model="section" />
    </div>
    <div class="col-md-9">
      <CommercialOffers
        v-if="section === 'getadmin.partnerDetail.mb.commercialOffer'"
        :partner="partner"
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

  data() {
    return {
      section: 'getadmin.partnerDetail.mb.commercialOffer',

      menuItems: [
        'getadmin.partnerDetail.mb.commercialOffer',
        'getadmin.partnerDetail.mb.offerAndProduct',
        'getadmin.partnerDetail.mb.customerDescription',
        'getadmin.partnerDetail.mb.clientContactDescription',
        'getadmin.partnerDetail.mb.deliveryAdresses',
        'getadmin.partnerDetail.mb.paymentMethod',
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
