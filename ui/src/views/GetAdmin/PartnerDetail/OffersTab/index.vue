<template>
  <div class="row">
    <div class="col-md-3">
      <ul class="list-group">
        <li v-for="item in menuItems" :key="item" class="list-group-item">
          <a @click.prevent="section = item" :class="{ active: section == item }" href="#">
            {{ $t(item) }}
            <i class="ic-Arrow-Next-Icon float-right"></i>
          </a>
        </li>
      </ul>
    </div>
    <div class="col-md-9">
      <OffersCards v-if="section === 'filters.offers'" :partner="partner" />
      <SimCards v-if="section === 'getadmin.users.simcards'" :partner="partner" />
    </div>
  </div>
</template>

<script>
import OffersCards from './OffersCards';
import SimCards from './SimCards';

export default {
  components: {
    OffersCards,
    SimCards,
  },

  props: {
    partner: Object,
  },

  data() {
    return {
      section: 'filters.offers',

      menuItems: ['filters.offers', 'getadmin.users.simcards', 'getadmin.users.supervision'],
    };
  },
};
</script>

<style lang="scss" scoped></style>
