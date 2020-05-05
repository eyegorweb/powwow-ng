<template>
  <div class="row">
    <div class="col-md-3">
      <ul class="list-group">
        <li
          v-for="item in menuItems"
          :key="item"
          class="list-group-item"
          :class="{ disableSubMenu: item != 'getadmin.customize.broadcastLists' }"
        >
          <a @click.prevent="section = item" :class="{ active: section == item }" href="#">
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
    </div>
  </div>
</template>

<script>
import BroadcastLists from './BroadcastLists';

export default {
  props: {
    partnerid: {
      type: String,
      default: undefined,
    },
  },
  components: {
    BroadcastLists,
  },

  data() {
    return {
      section: 'getadmin.customize.broadcastLists',

      menuItems: [
        'getadmin.customize.broadcastLists',
        'getadmin.customize.freeField',
        'getadmin.customize.deliveryAddress',
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
