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
    <div class="col-md-9"></div>
  </div>
</template>

<script>
export default {
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
