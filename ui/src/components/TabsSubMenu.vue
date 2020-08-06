<template>
  <ul class="list-group">
    <li v-for="item in menuItems" :key="item" class="list-group-item">
      <a @click.prevent="section = item" :class="{ active: section === item }" href="#">
        {{ $t(item) }}
        <i class="ic-Arrow-Next-Icon float-right"></i>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    menuItems: Array,
    value: String,
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

<style lang="scss" scoped></style>
