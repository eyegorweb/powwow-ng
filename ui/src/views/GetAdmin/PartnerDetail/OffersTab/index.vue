<template>
  <div class="row">
    <div class="col-md-3">
      <TabsSubMenu :menu-items="menuItems" v-model="section" />
    </div>
    <div class="col-md-9">
      <OffersCards v-if="section === 'filters.offers'" :partner="partner" />
      <SimCards v-if="section === 'getadmin.users.simcards'" :partner="partner" />
    </div>
  </div>
</template>

<script>
import OffersCards from './OffersCards';
import SimCards from './SimCards';
import TabsSubMenu from '@/components/TabsSubMenu.vue';

export default {
  components: {
    OffersCards,
    SimCards,
    TabsSubMenu,
  },

  props: {
    partner: Object,
  },

  mounted() {
    if (this.partner.partyType === 'CUSTOMER') {
      this.menuItems.push('getadmin.users.supervision');
    }
  },

  data() {
    return {
      section: 'filters.offers',

      menuItems: ['filters.offers', 'getadmin.users.simcards'],
    };
  },
};
</script>

<style lang="scss" scoped></style>
