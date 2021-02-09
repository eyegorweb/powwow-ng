<template>
  <div class="row">
    <div class="col-md-3">
      <ul class="list-group">
        <li
          v-for="item in menuItems"
          :key="item.title"
          class="list-group-item"
        >
          <router-link :to="item.to" :class="{ active: $route.name == item.to.name }">
            {{ $t(item.title) }} <i class="ic-Arrow-Next-Icon float-right"></i>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="col-md-9">
      <router-view :partnerid="''+partner.id" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    partner: Object,
  },


  computed: {
    ...mapGetters(['userIsBO', 'havePermission']),
  },

  mounted() {
    if (this.havePermission('party', 'read_broadcast_list')) {
      this.menuItems.push({
        section: 'admins',
        title: 'getadmin.customize.broadcastLists',
        to: {
          name: 'partnerDetail.customize.broadcastLists',
          params: { partner: this.partner },
        },
      });
    }
    if (this.havePermission('party', 'read_delivery_address') && (this.partner.partyType != 'MULTI_CUSTOMER')) {
      this.menuItems.push({
        section: 'deliveryAddress',
        title: 'getadmin.customize.deliveryAddress',
        to: {
          name: 'partnerDetail.customize.deliveryAddress',
          params: { partner: this.partner },
        },
      });
    }

    if (this.havePermission('party', 'read_custom_field') && (this.partner.partyType != 'MVNO')) {
      this.menuItems.push({
        section: 'customFields',
        title: 'getadmin.customize.customFields',
        to: {
          name: 'partnerDetail.customize.customFields',
          params: { partner: this.partner },
        },
      });
    }

    if (this.havePermission('party', 'read_specific_field') && (this.userIsBO) && (this.partner.partyType != 'MVNO')) {
      this.menuItems.push({
        section: 'specificFields',
        title: 'getadmin.customize.specificFields',
        to: {
          name: 'partnerDetail.customize.specificFields',
          params: { partner: this.partner },
        },
      });
    }
  },

  data() {
    return {
      section: undefined,
      menuItems: [],
    };
  },

  methods: {
    // Gestion des permissions sur les onglets
    filterByPermission(arrayInput) {
      let permit = false;
      return arrayInput.filter((a) => {
        if (!a.permissions) return true;
        a.permissions.forEach(e => {
          if(this.havePermission(e.domain, e.action)) {
            permit = true;
          }
        });
        return permit;
      });
    },
    hideMenuItem(menu, item) {
      const foundItem = menu.findIndex(i => i === item);
      if (foundItem !== -1) {
        return menu.splice(foundItem, 1);
      }
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
