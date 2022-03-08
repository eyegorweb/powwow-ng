<template>
  <div class="domain-group">
    <div class="list-group-item domain-item">
      <div>{{ domain.labelDomain }}</div>
      <a class="p-0" @click.prevent="isOpen = !isOpen">
        {{ isOpen ? $t('getadmin.hidePermissions') : $t('getadmin.showPermissions') }}

        <em :class="iconClass" />
      </a>
    </div>

    <TransitionCollapse>
      <div class="permissions-container" v-if="isOpen">
        <slot :domain="domain" />
      </div>
    </TransitionCollapse>
  </div>
</template>

<script>
import TransitionCollapse from '@/components/TransitionCollapse';

export default {
  components: {
    TransitionCollapse,
  },
  props: {
    domain: Object,
    defaultOpen: Boolean,
  },

  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    iconClass() {
      return this.isOpen ? 'ic-Arrow-Up-Icon' : 'ic-Arrow-Down-Icon';
    },
  },

  mounted() {
    this.isOpen = this.defaultOpen;
  },

  watch: {
    defaultOpen(newValue) {
      this.isOpen = newValue;
    },
  },
};
</script>

<style lang="scss" scoped>
.domain-group:not(:last-child) {
  .domain-item {
    border-bottom: none;
    & + .permissions-container {
      .permission-item:first-child {
        border-top: 1px solid rgba(0, 0, 0, 0.125) !important;
      }
    }
  }
}

.domain-group:first-child {
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
}

.domain-item {
  background: #f6f8fa;
  user-select: none;

  a {
    color: $primary;
    font-size: 0.8rem;
    &:hover,
    &:visited,
    &:link,
    &:active {
      text-decoration: none;
    }
    &:hover {
      cursor: pointer;
    }
  }
}

.permissions-container {
  border-left: 1px solid rgba(0, 0, 0, 0.125);
  border-right: 1px solid rgba(0, 0, 0, 0.125);
}

.permission-item span {
  position: relative;
  bottom: 0.3rem;
}

.permission-item:hover {
  cursor: pointer;
  background: $light-gray;
}
</style>
