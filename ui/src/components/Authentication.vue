<template>
  <span>
    <iframe v-if="refreshingToken" :src="refreshUrl" @load="onRefreshTokenPageLoaded" />
  </span>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { redirectTo } from '@/utils';
import { log } from '@/utils';
import { getBaseURL } from '@/utils.js';

export default {
  name: 'Authentication',
  created() {
    this.ensureUserIsAuthentified();
  },
  methods: {
    ...mapActions(['ensureTokenExists', 'setAuthToken', 'fetchUserInfos']),
    ...mapMutations(['stopRefreshingToken', 'startRefreshingToken', 'appIsReady']),

    ensureUserIsAuthentified() {
      const ignoredNames = [
        'callback',
        'refresh',
        'createAccount',
        'createAccount.partner',
        'createAccount.offer',
        'createAccount.simChoice',
        'createAccount.delivery',
      ];
      const shouldIgnore = ignoredNames.find((e) => e === this.$route.name);

      if (this.isAnonymous) {
        console.log('Anonymous');
        this.imReady();
        return;
      }

      if (shouldIgnore) {
        console.log('Ignore auth');
        return;
      } else {
        console.log('Not ignoring :', this.$route.name);
      }
      if (!this.token) {
        this.startRefreshingToken();
      }
    },

    redirectToLogin() {
      const targetUrl = `${this.authUrl}/oauth/authorize?response_type=token&client_id=${process.env.VUE_APP_CLIENT_ID}&redirect_uri=${window.location.origin}${process.env.VUE_APP_BASE_URL}/callback&prev=${this.currentUrl}`;
      redirectTo(targetUrl);
    },

    /*
      call the refresh url inslide the iframe, the server responds with content in the URL when refresh is possible
      and returns an error page with no content when refreshing token is no longuer possible
    */
    onRefreshTokenPageLoaded(frame) {
      try {
        console.log('onRefreshTokenPageLoaded');
        if (frame.target.contentDocument) {
          try {
            this.setAuthToken(
              frame.target.contentDocument.location.href.split('=')[1].split('&')[0]
            );
            console.log('onRefreshTokenPageLoaded imReady');
            this.imReady();
          } catch (e) {
            log('Erreur token', e, frame.target.contentDocument.location);
            this.redirectToLogin();
          }

          this.stopRefreshingToken();
        } else {
          this.redirectToLogin();
        }
      } catch (e) {
        console.log('onRefreshTokenPageLoaded', e);
        log('Erreur refresh ', e);
        this.stopRefreshingToken();
      }
    },

    async imReady() {
      if (!this.isAnonymous) {
        await this.fetchUserInfos();
      }
      this.appIsReady();
    },
  },
  computed: {
    ...mapGetters(['refreshingToken', 'token']),
    isAnonymous() {
      if (this.currentUrl.includes('create-account')) {
        return true;
      }
      return false;
    },
    currentUrl() {
      const sameUrl =
        location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');

      return window.location.href.replace(sameUrl, '');
    },
    authUrl() {
      return getBaseURL();
    },
    refreshUrl() {
      return `${this.authUrl}/oauth/authorize?response_type=token&client_id=${process.env.VUE_APP_CLIENT_ID}&redirect_uri=${window.location.origin}/refresh.html`;
    },
  },
};
</script>

<style scoped>
iframe {
  width: 0;
  height: 0;
}
</style>
