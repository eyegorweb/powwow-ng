<template>
  <div class="row">
    <div class="col-md-3">
      <TabsSubMenu :menu-items="menuItems" v-model="section" />
    </div>
    <div class="col-md-9">
      <PartnerOptions v-if="section === 'getadmin.partners.options'" :partner="partner" />
      <AccountPartnerDetail
        v-if="section === 'getadmin.partners.accountDescription'"
        :partner="partner"
      />

      <M2MRange v-if="section === 'getadmin.partners.m2mRange.title'" :partner="partner" />
    </div>
  </div>
</template>

<script>
import PartnerOptions from './PartnerOptions';
import AccountPartnerDetail from './AccountPartnerDetail';
import M2MRange from './M2MRange';
import { mapGetters } from 'vuex';
import TabsSubMenu from '@/components/TabsSubMenu.vue';

export default {
  components: {
    PartnerOptions,
    AccountPartnerDetail,
    TabsSubMenu,
    M2MRange,
  },

  props: {
    partner: Object,
    partnerid: {
      type: String,
      default: undefined,
    },
  },

  mounted() {
    let menuItems = [];
    if (
      this.havePermission('party', 'read_account_detail') &&
      this.havePermission('party', 'read_options')
    ) {
      menuItems = ['getadmin.partners.accountDescription', 'getadmin.partners.options'];
      this.section = 'getadmin.partners.options';
    } else if (
      this.havePermission('party', 'read_account_detail') &&
      !this.havePermission('party', 'read_options')
    ) {
      menuItems = ['getadmin.partners.accountDescription'];
      this.section = 'getadmin.partners.accountDescription';
    } else if (
      !this.havePermission('party', 'read_account_detail') &&
      this.havePermission('party', 'read_options')
    ) {
      menuItems = ['getadmin.partners.options'];
      this.section = 'getadmin.partners.options';
    } else {
      menuItems = [];
      this.section = '';
    }
    if (this.partner && this.partner.partyType === 'MVNO') {
      this.menuItems.push('getadmin.partners.m2mRange.title');
    }

    this.menuItems = menuItems;
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
};
</script>

<style lang="scss" scoped></style>
