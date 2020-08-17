<template>
  <div class="row">
    <div class="col-md-3">
      <TabsSubMenu :menu-items="menuItems" v-model="section" />
    </div>
    <div class="col-md-9">
      <AdminCards v-if="section === 'getadmin.partners.admins'" :partnerid="partnerid" />
      <UsersCards v-if="section === 'getadmin.partners.users'" :partnerid="partnerid" />
    </div>
  </div>
</template>

<script>
import AdminCards from './AdminCards';
import UsersCards from './UsersCards';
import TabsSubMenu from '@/components/TabsSubMenu.vue';

export default {
  props: {
    partnerid: {
      type: String,
      default: undefined,
    },
    partner: Object,
  },
  components: {
    AdminCards,
    UsersCards,
    TabsSubMenu,
  },

  mounted() {
    if (this.partner.partyType !== 'MULTI_CUSTOMER') {
      this.menuItems.push('getadmin.partners.users', 'getadmin.partners.activityLog');
    }
  },

  data() {
    return {
      section: 'getadmin.partners.admins',

      menuItems: ['getadmin.partners.admins'],
    };
  },
};
</script>

<style lang="scss" scoped></style>
