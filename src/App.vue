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
</style>
