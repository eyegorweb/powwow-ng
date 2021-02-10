<template>
  <ul class="list-group">
    <li v-for="item in menuItems" :key="item.title" class="list-group-item">
      <router-link :to="item.to" :class="{ active: $route.name == item.to.name }">
        {{ $t(item.title) }} <i class="ic-Arrow-Next-Icon float-right"></i>
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    /**
     * [
     *  {
     * title: String,
     * to: {
     *    name: String,
     *    params: Object
     *   }
     *  }
     * ]
     */
    menuItems: Array,
  },

  computed: {
    section: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
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
