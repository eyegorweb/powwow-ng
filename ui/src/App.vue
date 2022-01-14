<template>
  <div id="app">
    <div :class="{ container: appIsReady }">
      <router-view v-if="$route.name === 'callback'" />

      <NavBars v-if="appIsReady && !isAnonymousPage" :is-backoffice-profile="userIsBO" />
      <router-view v-if="appIsReady" />
      <PanelSwitcher v-if="appIsReady" />
      <PendingActions v-if="appIsReady && !isAnonymousPage" />
    </div>

    <Authentication />

    <FlashMessages />
    <ConfirmationModal />
    <ff-toggle />
    <ExportButtonModals />
    <DownloadManager />
    <AppVersion />
  </div>
</template>

<script>
import Authentication from '@/components/Authentication';
import NavBars from '@/components/NavBars';
import ExportButtonModals from '@/components/ExportButtonModals';
import PanelSwitcher from '@/components/PanelSwitcher';
import ConfirmationModal from '@/components/ConfirmationModal';
import FlashMessages from '@/components/ui/messages/FlashMessages';
import PendingActions from '@/components/ui/messages/PendingActions';
import DownloadManager from '@/components/DownloadManager.vue';
import AppVersion from '@/components/AppVersion.vue';
import { mapMutations, mapGetters } from 'vuex';
import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui.js';
import 'jquery-ui-dist/jquery-ui.css';
import exportingInit from 'highcharts/modules/exporting';
import Highcharts from 'highcharts';

exportingInit(Highcharts);

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
    AppVersion,
    PendingActions,
  },
  methods: {
    ...mapMutations(['closePanel']),
  },
  computed: {
    ...mapGetters([
      'userIsBO',
      'appIsReady',
      'userInfos',
      'singlePartner',
      'userIsPartner',
      'userIsMultiPartner',
    ]),

    isAnonymousPage() {
      if (this.currentUrl.includes('create-account')) {
        return true;
      }

      return false;
    },

    canShowNavbarForCurrentRoute() {
      return ![
        'catalog',
        'createAccount',
        'createAccount.partner',
        'createAccount.offer',
        'createAccount.simChoice',
        'createAccount.delivery',
      ].find((k) => k === this.$route.name);
    },
    currentUrl() {
      const sameUrl =
        location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');

      return window.location.href.replace(sameUrl, '');
    },
  },
  watch: {
    $route() {
      this.closePanel();
    },
    singlePartner(value) {
      this.$pushAnalytics({ partner: value != null ? value.name : '' });
    },
    userInfos(value) {
      this.$pushAnalytics({
        userProfile:
          value != null
            ? value.isAdminOrBackOffice
              ? this.userIsBO
                ? 'BO'
                : 'Admin'
              : this.userIsPartner || this.userIsMultiPartner
              ? 'Partner'
              : 'Unknown'
            : 'Unknown',
      });
    },
    appIsReady(value) {
      if (value) {
        // Jquery est utilisé ici car le loader ne fait pas partie de l'application Vue
        $('#app-loader').fadeOut(400);

        this.$startAnalytics();

        setTimeout(() => {
          if (this.$route.name != 'callback') {
            this.$pushAnalyticsIfReady({
              event: 'm2m.PageView',
              to: { name: this.$route.name, path: this.$route.path },
            });
          }
        }, 100);
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
