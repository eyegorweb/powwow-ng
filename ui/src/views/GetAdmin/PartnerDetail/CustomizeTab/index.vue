<template>
  <div class="row">
    <div class="col-md-3">
      <TabsSubMenu :menu-items="menuItems" v-model="section" />
    </div>
    <div class="col-md-9">
      <BroadcastLists
        v-if="section === 'getadmin.customize.broadcastLists'"
        :partnerid="partnerid"
      />
      <CustomFields v-if="section === 'getadmin.customize.customFields'" :partnerid="partnerid" />
      <SpecificFields
        v-if="section === 'getadmin.customize.specificFields'"
        :partnerid="partnerid"
      />
      <DeliveryAddress
        v-if="section === 'getadmin.customize.deliveryAddress'"
        :partnerid="partnerid"
      />
    </div>
  </div>
</template>

<script>
import BroadcastLists from './BroadcastLists';
import CustomFields from './CustomFields';
import SpecificFields from './SpecificFields';
import DeliveryAddress from './DeliveryAddress';
import TabsSubMenu from '@/components/TabsSubMenu.vue';
import { mapGetters } from 'vuex';

export default {
  props: {
    partnerid: {
      type: String,
      default: undefined,
    },
    partner: Object,
  },
  components: {
    BroadcastLists,
    CustomFields,
    SpecificFields,
    DeliveryAddress,
    TabsSubMenu,
  },

  computed: {
    ...mapGetters(['userIsBO', 'havePermission']),
  },

  mounted() {
    if (this.havePermission('party', 'read_broadcast_list')) {
      this.menuItems.push('getadmin.customize.broadcastLists');
    }
    if (this.havePermission('party', 'read_delivery_address')) {
      this.menuItems.push('getadmin.customize.deliveryAddress');
    }

    this.menuItems.push('getadmin.customize.customFields', 'getadmin.customize.specificFields');

    if (!this.userIsBO) {
      this.hideMenuItem(this.menuItems, 'getadmin.customize.specificFields');
    }
    if (this.partner.partyType === 'MVNO') {
      this.hideMenuItem(this.menuItems, 'getadmin.customize.customFields');
      this.hideMenuItem(this.menuItems, 'getadmin.customize.specificFields');
    }
    if (this.partner.partyType === 'MULTI_CUSTOMER') {
      this.hideMenuItem(this.menuItems, 'getadmin.customize.deliveryAddress');
    }
    this.section = this.menuItems[0] || '';
  },

  data() {
    return {
      section: undefined,
      menuItems: [],
    };
  },

  methods: {
    hideMenuItem(menu, item) {
      const foundItem = menu.findIndex(i => i === item);
      if (foundItem !== -1) {
        return menu.splice(foundItem, 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
