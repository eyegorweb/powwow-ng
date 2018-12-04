<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/filters">Filters</router-link>|
      <router-link to="/secured">Secured</router-link>|
      <router-link to="/draghome">DragHome</router-link>|
    </div>
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
