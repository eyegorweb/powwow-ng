<template>
  <div class="row">
    <div v-if="menuItems" class="col-md-3">
      <ul class="list-group">
        <li
          v-for="item in visibleMenuItems"
          :key="item.title"
          :class="({ '-inactive': !isLineActive }, `menu_${item.section}`)"
          class="list-group-item"
        >
          <router-link :to="item.to" :class="{ active: $route.name == item.to.name }">
            {{ $t(item.title) }} <i class="ic-Arrow-Next-Icon float-right"></i>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="col-md-9">
      <router-view v-if="content" :content="content" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    content: Object,
  },
  data() {
    return {
      section: 'line_info',
      menuItems: undefined,
    };
  },
  mounted() {
    const typeForPartner = this.$loGet(this.content, 'party.partyType');
    this.menuItems = this.filterByPermission([
      {
        section: 'line_info',
        title: 'getparc.lineDetail.tab1.lineInfo',
        compatiblePartnerTypes: ['CUSTOMER', 'MVNO', 'MULTI_CUSTOMER', 'M2M_LIGHT'],
        to: {
          name: 'lineDetail.details.info',
          meta: { label: 'Détail de la ligne - Informations' },
          params: { lineId: this.$route.params.lineId, meta: this.content },
        },
      },
      {
        section: 'billing',
        title: 'getparc.lineDetail.tab1.billingOffer.title',
        compatiblePartnerTypes: ['CUSTOMER', 'MVNO', 'MULTI_CUSTOMER', 'M2M_LIGHT'],
        to: {
          name: 'lineDetail.details.billing',
          meta: { label: 'Détail de la ligne - Facturation et offre' },
          params: { lineId: this.$route.params.lineId, meta: this.content },
        },
      },
      {
        section: 'line_services',
        title: 'getparc.lineDetail.tab1.lineServices',
        compatiblePartnerTypes: ['CUSTOMER', 'MVNO', 'MULTI_CUSTOMER'],
        to: {
          name: 'lineDetail.details.services',
          meta: { label: 'Détail de la ligne - Services de la ligne' },
          params: { lineId: this.$route.params.lineId, meta: this.content },
        },
      },
      {
        section: 'alarm_list',
        title: 'getparc.lineDetail.tab1.alarmsList',
        compatiblePartnerTypes: ['CUSTOMER', 'MULTI_CUSTOMER', 'M2M_LIGHT'],
        permission: [{ domain: 'alarm', action: 'read' }],
        to: {
          name: 'lineDetail.details.alarms',
          meta: { label: 'Détail de la ligne - Liste des alarmes' },
          params: { lineId: this.$route.params.lineId, meta: this.content },
          query: { partnerType: typeForPartner },
        },
      },
      {
        section: 'acts_history',
        title: 'getparc.lineDetail.tab1.actsHistory',
        compatiblePartnerTypes: ['CUSTOMER', 'MVNO', 'MULTI_CUSTOMER', 'M2M_LIGHT'],
        to: {
          name: 'lineDetail.details.acts',
          meta: { label: 'Détail de la ligne - Suivi/pilotage des actes de gestion' },
          params: { lineId: this.$route.params.lineId, meta: this.content },
          query: { partnerType: typeForPartner },
        },
      },
    ]);
  },

  computed: {
    ...mapGetters(['havePermission']),
    visibleMenuItems() {
      const typeForPartner = this.$loGet(this.content, 'party.partyType');
      let visibleItems = this.menuItems.filter((m) =>
        m.compatiblePartnerTypes.some((p) => p === typeForPartner)
      );
      return visibleItems;
    },
    isLineActive() {
      const networkStatus = this.$loGet(this.content, 'accessPoint.networkStatus');
      const simStatus = this.$loGet(this.content, 'statuts');
      return (
        simStatus === 'ALLOCATED' &&
        (networkStatus === 'ACTIVATED' || networkStatus === 'SUSPENDED')
      );
    },
  },

  methods: {
    // Gestion des permissions sur les onglets
    filterByPermission(arrayInput) {
      let permit = false;
      return arrayInput.filter((a) => {
        if (!a.permission) return true;
        a.permission.forEach((e) => {
          if (this.havePermission(e.domain, e.action)) {
            permit = true;
          }
        });
        return permit && this.isLineActive;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.list-group-item {
  a {
    color: black;

    &.active {
      color: $primary;
    }
  }
}
</style>
