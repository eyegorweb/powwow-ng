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
    </div>
  </div>
</template>

<script>
import PartnerOptions from './PartnerOptions';
import AccountPartnerDetail from './AccountPartnerDetail';
import { mapGetters } from 'vuex';
import TabsSubMenu from '@/components/TabsSubMenu.vue';

export default {
  components: {
    PartnerOptions,
    AccountPartnerDetail,
    TabsSubMenu,
  },

  props: {
    partner: Object,
    partnerid: {
      type: String,
      default: undefined,
    },
  },

  mounted() {
    if (
      this.havePermission('party', 'read_account_detail') &&
      this.havePermission('party', 'read_options')
    ) {
      this.menuItems = ['getadmin.partners.accountDescription', 'getadmin.partners.options'];
      this.section = 'getadmin.partners.options';
    } else if (
      this.havePermission('party', 'read_account_detail') &&
      !this.havePermission('party', 'read_options')
    ) {
      this.menuItems = ['getadmin.partners.accountDescription'];
      this.section = 'getadmin.partners.accountDescription';
    } else if (
      !this.havePermission('party', 'read_account_detail') &&
      this.havePermission('party', 'read_options')
    ) {
      this.menuItems = ['getadmin.partners.options'];
      this.section = 'getadmin.partners.options';
    } else {
      this.menuItems = [];
      this.section = '';
    }
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
