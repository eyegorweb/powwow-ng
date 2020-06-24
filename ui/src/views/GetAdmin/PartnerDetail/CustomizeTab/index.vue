<template>
  <div class="row">
    <div class="col-md-3">
      <ul class="list-group">
        <li v-for="item in menuItems" :key="item" class="list-group-item">
          <a @click.prevent="section = item" :class="{ active: section === item }" href="#">
            {{ $t(item) }}
            <i class="ic-Arrow-Next-Icon float-right"></i>
          </a>
        </li>
      </ul>
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
import { mapGetters } from 'vuex';

export default {
  props: {
    partnerid: {
      type: String,
      default: undefined,
    },
  },
  components: {
    BroadcastLists,
    CustomFields,
    SpecificFields,
    DeliveryAddress,
  },

  computed: {
    ...mapGetters(['userIsBO']),
  },

  mounted() {
    if (!this.userIsBO) {
      this.visibleMenuItems(this.menuItems, 'getadmin.customize.specificFields');
    }
  },

  data() {
    return {
      section: 'getadmin.customize.broadcastLists',

      menuItems: [
        'getadmin.customize.broadcastLists',
        'getadmin.customize.customFields',
        'getadmin.customize.specificFields',
        'getadmin.customize.deliveryAddress',
      ],
    };
  },

  methods: {
    visibleMenuItems(menu, item) {
      return menu.splice(
        menu.findIndex(i => i === item),
        1
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
