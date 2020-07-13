<template>
  <div id="app">
    <div :class="{ container: appIsReady }">
      <NavBars v-if="appIsReady && $route.name !== 'catalog'" :is-backoffice-profile="userIsBO" />
      <router-view />
      <PanelSwitcher v-if="appIsReady" />
    </div>

    <Authentication />
    <FlashMessages />
    <ConfirmationModal />
    <ff-toggle />
    <ExportButtonModals />
    <DownloadManager />
  </div>
</template>

<script>
import Authentication from '@/components/Authentication';
import NavBars from '@/components/NavBars';
import ExportButtonModals from '@/components/ExportButtonModals';
import PanelSwitcher from '@/components/PanelSwitcher';
import ConfirmationModal from '@/components/ConfirmationModal';
import FlashMessages from '@/components/ui/messages/FlashMessages';
import DownloadManager from '@/components/DownloadManager.vue';
import { mapMutations, mapGetters } from 'vuex';
import $ from 'jquery';

export default {
  name: 'App',
  components: {
    Authentication,
    NavBars,
    PanelSwitcher,
    FlashMessages,
    ConfirmationModal,
    ExportButtonModals,
    DownloadManager,
  },
  methods: {
    ...mapMutations(['closePanel']),
  },
  computed: {
    ...mapGetters(['userIsBO', 'appIsReady']),
  },
  watch: {
    $route() {
      this.closePanel();
    },
    appIsReady(value) {
      if (value) {
        // Jquery est utilisé ici car le loader ne fait pas partie de l'application Vue
        $('#app-loader').fadeOut(400);
      }
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
    font-size: 10px;
  }
}

@media (min-width: 1300px) and (max-width: 1450px) {
  .container {
    max-width: 1300px;
  }
  html {
    font-size: 11px;
  }
}
</style>
