<template>
  <div class="row">
    <!-- <div class="col-md-3">
      <TabsSubMenu :menu-items="menuItems" v-model="section" />
    </div> -->
    <div class="col-md-3">
      <ul class="list-group">
        <li v-for="item in menuItems" :key="item.title" class="list-group-item">
          <router-link :to="item.to" :class="{ active: $route.name == item.to.name }">
            {{ $t(item.title) }} <i class="ic-Arrow-Next-Icon float-right"></i>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="col-md-9">
      <router-view :partnerid="'' + partner.id" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    partner: Object,
  },

  mounted() {
    // if (this.partner.partyType !== 'MULTI_CUSTOMER') {
    //   if (this.havePermission('party', 'read_administrator')) {
    //     this.menuItems.push('getadmin.partners.admins');
    //   }
    //   if (this.havePermission('user', 'read')) {
    //     this.menuItems.push('getadmin.partners.users');
    //   }
    // } else {
    //   if (this.havePermission('user', 'read')) {
    //     this.menuItems.push('getadmin.partners.users');
    //   }
    // }
    // this.initSection(this.menuItems);
    this.menuItems = this.filterByPermission([
      {
        section: 'admins',
        title: 'getadmin.partners.admins',
        // compatiblePartnerTypes: ['CUSTOMER', 'MULTI_CUSTOMER'],
        // permission: { domain: 'getParc', action: 'manage_coach' },
        to: {
          name: 'partnerDetail.users.admins',
          params: { partner: this.partner },
        },
      },
      {
        section: 'users',
        title: 'getadmin.partners.users',
        // compatiblePartnerTypes: ['CUSTOMER', 'MULTI_CUSTOMER'],
        // permission: { domain: 'getParc', action: 'manage_coach' },
        to: {
          name: 'partnerDetail.users.users',
          params: { partner: this.partner },
        },
      },
    ]);
  },

  computed: {
    ...mapGetters(['havePermission']),
  },

  data() {
    return {
      section: 'getadmin.partners.users',

      menuItems: [],
    };
  },

  methods: {
    initSection(menu) {
      if (!menu.length) return;
      this.section = menu.find((a) => a);
    },
    // Gestion des permissions sur les onglets
    filterByPermission(arrayInput) {
      let permit = false;
      return arrayInput.filter((a) => {
        if (!a.permissions) return true;
        a.permissions.forEach((e) => {
          if (this.havePermission(e.domain, e.action)) {
            permit = true;
          }
        });
        return permit;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.list-group-item {
  &.-inactive {
    pointer-events: none;
    background-color: $gray-400;
  }
  a {
    color: black;

    &.active {
      color: $primary;
    }
  }
}
</style>
