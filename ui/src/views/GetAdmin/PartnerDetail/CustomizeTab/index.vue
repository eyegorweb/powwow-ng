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
    ...mapGetters(['userIsBO']),
  },

  mounted() {
    if (!this.userIsBO) {
      this.visibleMenuItems(this.menuItems, 'getadmin.customize.specificFields');
    }
    if (this.partner.partyType === 'MVNO') {
      this.visibleMenuItems(this.menuItems, 'getadmin.customize.customFields');
      this.visibleMenuItems(this.menuItems, 'getadmin.customize.specificFields');
    }
    if (this.partner.partyType === 'MULTI_CUSTOMER') {
      this.visibleMenuItems(this.menuItems, 'getadmin.customize.deliveryAddress');
    }
    // Display 1st available submenu (due to permissions' aside effect)
    this.section = this.menuItems[0] || '';
  },

  data() {
    return {
      section: undefined,

      menuItems: [
        'getadmin.customize.broadcastLists',
        'getadmin.customize.deliveryAddress',
        'getadmin.customize.customFields',
        'getadmin.customize.specificFields',
      ],
    };
  },

  methods: {
    visibleMenuItems(menu, item) {
      return menu.splice(menu.findIndex(i => i === item), 1);
    },
  },
};
</script>

<style lang="scss" scoped></style>
