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
import { mapGetters } from 'vuex';

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
    if (this.havePermission('party', 'read_available_catalog_offers')) {
      this.menuItems.push('filters.offers');
    }
    if (this.havePermission('party', 'read_available_sims')) {
      this.menuItems.push('getadmin.users.simcards');
    }
    if (
      this.partner.partyType === 'CUSTOMER' &&
      this.havePermission('party', 'read_supervision_option')
    ) {
      this.menuItems.push('getadmin.users.supervision');
    }
    this.initSection(this.menuItems);
  },

  data() {
    return {
      section: undefined,

      menuItems: [],
    };
  },

  computed: {
    ...mapGetters(['havePermission']),
  },

  methods: {
    initSection(menu) {
      if (!menu.length) return;
      this.section = menu.find(a => a);
    },
  },
};
</script>

<style lang="scss" scoped></style>
