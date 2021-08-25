<template>
  <div class="row">
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
      <router-view :partner="partner" />
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
    if (this.havePermission('party', 'read_available_catalog_offers')) {
      this.menuItems.push({
        section: 'offersCards',
        title: 'filters.offers',
        to: {
          name: 'partnerDetail.offersAndSim.offers',
          params: { partner: this.partner },
        },
      });
    }
    if (this.havePermission('party', 'read_available_sims')) {
      this.menuItems.push({
        section: 'simcards',
        title: 'getadmin.users.simcards',
        to: {
          name: 'partnerDetail.offersAndSim.simCards',
          params: { partner: this.partner },
        },
      });
    }
    this.menuItems.push({
      section: 'supervision',
      title: 'getadmin.users.supervision',
      to: {
        name: 'partnerDetail.offersAndSim.supervisionOptions',
        params: { partner: this.partner },
      },
    });
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
    // Gestion des permissions sur sous menus
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
