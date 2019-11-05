<template>
  <div id="app">
    <div class="container">
      <NavBars :is-backoffice-profile="!userIsPartner" />
      <router-view />
      <PanelSwitcher />
    </div>

    <Authentication />
    <FlashMessages />
    <ConfirmationModal />
  </div>
</template>

<script>
import Authentication from '@/components/Authentication';
import NavBars from '@/components/NavBars';
import PanelSwitcher from '@/components/PanelSwitcher';
import ConfirmationModal from '@/components/ConfirmationModal';
import FlashMessages from '@/components/ui/messages/FlashMessages';
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    Authentication,
    NavBars,
    PanelSwitcher,
    FlashMessages,
    ConfirmationModal,
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

@media (width: 1366px) {
  .container {
    max-width: 1200px;
  }
}

@media (width: 1280px) {
  .container {
    max-width: 1200px;
  }
  html {
    font-size: 12px;
  }
}
</style>
