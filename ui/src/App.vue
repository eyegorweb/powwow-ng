<template>
  <div id="app">
    <div class="container">
      <NavBars :is-backoffice-profile="!userIsPartner" />
      <router-view />
      <PanelSwitcher />
    </div>

    <Authentication />
  </div>
</template>

<script>
import Authentication from '@/components/Authentication';
import NavBars from '@/components/NavBars';
import PanelSwitcher from '@/components/PanelSwitcher';
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    Authentication,
    NavBars,
    PanelSwitcher,
  },
  methods: {
    ...mapMutations(['closePanel']),
  },
  computed: {
    ...mapGetters(['userIsPartner']),
  },
  watch: {
    $route() {
      this.closePanel();
    },
  },
};
</script>

<style lang="scss">
@import 'theme/scss/styles.scss';
h4 {
  font-weight: 400;
  line-height: 2rem;
  color: $dark-gray;
  i {
    color: $gray-400;
  }
}

@media only screen and (max-width: 1024px) {
  html {
    font-size: 10px;
  }
}

@media only screen and (min-width: 1025px) and (max-width: 1366px) {
  html {
    font-size: 10px;
  }
}
</style>
