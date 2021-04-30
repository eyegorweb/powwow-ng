<template>
  <div class="row">
    <div v-if="menuItems" class="col-md-3">
      <ul class="list-group">
        <li
          v-for="item in visibleMenuItems"
          :key="item.title"
          :class="`menu_${item.section}`"
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
    this.menuItems = [
      {
        section: 'line_info',
        title: 'getparc.lineDetail.tab1.lineInfo',
        compatiblePartnerTypes: ['CUSTOMER', 'MVNO', 'MULTI_CUSTOMER'],
        to: {
          name: 'lineDetail.details.info',
          params: { lineId: this.$route.params.lineId, meta: this.content },
        },
      },
      {
        section: 'billing',
        title: 'getparc.lineDetail.tab1.billingOffer.title',
        compatiblePartnerTypes: ['CUSTOMER', 'MVNO', 'MULTI_CUSTOMER'],
        to: {
          name: 'lineDetail.details.billing',
          params: { lineId: this.$route.params.lineId, meta: this.content },
        },
      },
      {
        section: 'line_services',
        title: 'getparc.lineDetail.tab1.lineServices',
        compatiblePartnerTypes: ['CUSTOMER', 'MVNO', 'MULTI_CUSTOMER'],
        to: {
          name: 'lineDetail.details.services',
          params: { lineId: this.$route.params.lineId, meta: this.content },
        },
      },
      {
        section: 'alarm_list',
        title: 'getparc.lineDetail.tab1.alarmsList',
        compatiblePartnerTypes: ['CUSTOMER', 'MULTI_CUSTOMER'],
        to: {
          name: 'lineDetail.details.alarms',
          params: { lineId: this.$route.params.lineId, meta: this.content },
        },
      },
      {
        section: 'acts_history',
        title: 'getparc.lineDetail.tab1.actsHistory',
        compatiblePartnerTypes: ['CUSTOMER', 'MVNO', 'MULTI_CUSTOMER'],
        to: {
          name: 'lineDetail.details.acts',
          params: { lineId: this.$route.params.lineId, meta: this.content },
        },
      },
    ];
  },

  computed: {
    visibleMenuItems() {
      const typeForPartner = this.$loGet(this.content, 'party.partyType');
      let visibleItems = this.menuItems.filter((m) =>
        m.compatiblePartnerTypes.some((p) => p === typeForPartner)
      );
      return visibleItems;
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
