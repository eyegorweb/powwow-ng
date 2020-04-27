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
      <AdminCards v-if="section === 'getadmin.partners.admins'" :partnerid="partnerid" />
      <UsersCards v-if="section === 'getadmin.partners.users'" :partnerid="partnerid" />
    </div>
  </div>
</template>

<script>
import AdminCards from './AdminCards';
import UsersCards from './UsersCards';

export default {
  props: {
    partnerid: {
      type: String,
      default: undefined,
    },
  },
  components: {
    AdminCards,
    UsersCards,
  },

  data() {
    return {
      section: 'getadmin.partners.admins',

      menuItems: [
        'getadmin.partners.admins',
        'getadmin.partners.users',
        'getadmin.partners.activityLog',
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
