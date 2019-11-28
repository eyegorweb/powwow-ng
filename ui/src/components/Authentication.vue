<template>
  <span>
    <iframe v-if="refreshingToken" :src="refreshUrl" @load="onRefreshTokenPageLoaded" />
  </span>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { redirectTo } from '@/utils';
import { log } from '@/utils';

export default {
  name: 'Authentication',
  created() {
    this.ensureUserIsAuthentified();
  },
  methods: {
    ...mapActions(['ensureTokenExists', 'setAuthToken']),
    ...mapMutations(['stopRefreshingToken']),

    ensureUserIsAuthentified() {
      if (this.$route.name === 'callback' || this.$route.name === 'refresh') {
        return;
      }
      if (!this.token) {
        this.redirectToLogin();
      }
    },

    redirectToLogin() {
      // _ = route avant la redirection
      localStorage.setItem('_', this.$route.path);
      console.log('Redirecting to login');
      redirectTo(
        `${this.authUrl}/oauth/authorize?response_type=token&client_id=${
          process.env.VUE_APP_CLIENT_ID
        }&redirect_uri=${window.location.origin}${process.env.VUE_APP_BASE_URL}/callback`
      );
    },

    /*
      call the refresh url inslide the iframe, the server responds with content in the URL when refresh is possible
      and returns an error page with no content when refreshing token is no longuer possible
    */
    onRefreshTokenPageLoaded(frame) {
      try {
        console.log('*** URL WITH NEW TOKEN ===', frame.target.contentDocument.location.href);
        if (frame.target.contentDocument) {
          try {
            this.setAuthToken(
              frame.target.contentDocument.location.href.split('=')[1].split('&')[0]
            );
          } catch (e) {
            log('Erreur token', e, frame.target.contentDocument.location);
            this.redirectToLogin();
          }

          this.stopRefreshingToken();
        } else {
          this.redirectToLogin();
        }
      } catch (e) {
        log('Erreur refresh ', e);
        this.stopRefreshingToken();
      }
    },
  },
  computed: {
    ...mapGetters(['refreshingToken', 'token']),
    authUrl() {
      const sameUrl =
        location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
      return process.env.VUE_APP_AUTH_SERVER_URL && process.env.VUE_APP_AUTH_SERVER_URL.length
        ? process.env.VUE_APP_AUTH_SERVER_URL
        : sameUrl;
    },
    refreshUrl() {
      const url = `${this.authUrl}/oauth/authorize?response_type=token&client_id=${
        process.env.VUE_APP_CLIENT_ID
      }&redirect_uri=${window.location.origin}${process.env.VUE_APP_BASE_URL}/callback`;
      console.log('*** URL TO REQUEST NEW TOKEN ===', url);

      return url;
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
