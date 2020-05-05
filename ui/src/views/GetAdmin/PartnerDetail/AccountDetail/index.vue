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
      <PartnerOptions v-if="section === 'getadmin.partners.options'" :partner="partner" />
    </div>
  </div>
</template>

<script>
import PartnerOptions from './PartnerOptions';

export default {
  components: {
    PartnerOptions,
  },

  props: {
    partner: Object,
    partnerid: {
      type: String,
      default: undefined,
    },
  },

  data() {
    return {
      section: 'getadmin.partners.options',

      menuItems: ['getadmin.partners.accountDescription', 'getadmin.partners.options'],
    };
  },
};
</script>

<style lang="scss" scoped></style>
