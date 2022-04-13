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
    partnerid: {
      type: String,
      default: undefined,
    },
  },

  mounted() {
    let menuItems = [];
    if (
      this.havePermission('party', 'read_account_detail') &&
      (this.havePermission('party', 'read_main_options') ||
        this.havePermission('party', 'read_secondary_options'))
    ) {
      menuItems = [
        {
          section: 'description',
          title: 'getadmin.partners.accountDescription',
          to: {
            name: 'partnerDetail.accountDetail.description',
            meta: { label: 'Détail du partenaire - Description' },
            params: { partner: this.partner },
          },
        },
        {
          section: 'options',
          title: 'getadmin.partners.options',
          to: {
            name: 'partnerDetail.accountDetail.options',
            meta: { label: 'Détail du partenaire - Options' },
            params: { partner: this.partner },
          },
        },
      ];
      this.section = 'getadmin.partners.options';
    } else if (
      this.havePermission('party', 'read_account_detail') &&
      !(
        this.havePermission('party', 'read_main_options') ||
        this.havePermission('party', 'read_secondary_options')
      )
    ) {
      menuItems = [
        {
          section: 'description',
          title: 'getadmin.partners.accountDescription',
          to: {
            name: 'partnerDetail.accountDetail.description',
            meta: { label: 'Détail du partenaire - Description' },
            params: { partner: this.partner },
          },
        },
      ];
    } else if (
      !this.havePermission('party', 'read_account_detail') &&
      (this.havePermission('party', 'read_main_options') ||
        this.havePermission('party', 'read_secondary_options'))
    ) {
      menuItems = [
        {
          section: 'options',
          title: 'getadmin.partners.options',
          to: {
            name: 'partnerDetail.accountDetail.options',
            meta: { label: 'Détail du partenaire - Options' },
            params: { partner: this.partner },
          },
        },
      ];
    } else {
      menuItems = [];
    }
    if (this.partner && this.partner.partyType === 'MVNO') {
      menuItems.push({
        section: 'options',
        title: 'getadmin.partners.m2mRange.title',
        to: {
          name: 'partnerDetail.accountDetail.m2mRange',
          meta: { label: 'Détail du partenaire - Plage MSISDN' },
          params: { partner: this.partner },
        },
      });
    }
    this.menuItems = menuItems;
  },

  data() {
    return {
      menuItems: [],
    };
  },

  methods: {
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
  computed: {
    ...mapGetters(['havePermission']),
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
