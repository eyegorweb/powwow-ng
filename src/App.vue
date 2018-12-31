<template>
  <div id="app">
    <router-view />
    <Authentication />
  </div>
</template>

<script>
import Authentication from '@/components/Authentication';

export default {
  name: 'App',
  components: {
    Authentication,
  },
};
</script>

<style lang="scss">
@import 'theme/scss/styles.scss';
</style>
