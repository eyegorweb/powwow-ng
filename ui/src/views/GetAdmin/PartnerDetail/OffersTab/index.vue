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
    </div>
  </div>
</template>

<script>
import OffersCards from './OffersCards';

export default {
  components: {
    OffersCards,
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
