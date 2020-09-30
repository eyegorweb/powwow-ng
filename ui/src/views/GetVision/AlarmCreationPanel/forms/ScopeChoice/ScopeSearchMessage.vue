<template>
  <div class="alert alert-primary alert-blue slide-up-reveal" role="alert">
    <a class="refresh" :class="{ rotate: isLoading }" @click.prevent="refresh" href="#">
      <i class="ic-Refresh-Icon" />
    </a>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    isLoading: Boolean,
  },

  methods: {
    refresh() {
      if (this.isLoading) return;

      this.$emit('refresh');
    },
  },
};
</script>

<style lang="scss" scoped>
a.refresh {
  float: right;
  text-decoration: none;
}

.rotate {
  animation: rotation 0.3s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
