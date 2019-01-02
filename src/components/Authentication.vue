<template>
  <span>
    <iframe
      v-if="refreshingToken"
      :src="refreshUrl"
      @load="onRefreshTokenPageLoaded"
    />
  </span>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { redirectTo } from '@/utils';

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
      redirectTo(
        `${process.env.VUE_APP_AUTH_SERVER_URL}/oauth/authorize?response_type=token&client_id=${
          process.env.VUE_APP_CLIENT_ID
        }&redirect_uri=${window.location.origin}/callback`
      );
    },

    /*
      call the refresh url inslide the iframe, the server responds with content in the URL when refresh is possible
      and returns an error page with no content when refreshing token is no longuer possible
    */
    onRefreshTokenPageLoaded(frame) {
      if (frame.target.contentDocument) {
        this.setAuthToken(frame.target.contentDocument.location.href.split('=')[1].split('&')[0]);
        this.stopRefreshingToken();
      } else {
        this.redirectToLogin();
      }
    },
  },
  computed: {
    ...mapGetters(['refreshingToken', 'token']),
    refreshUrl() {
      return `${
        process.env.VUE_APP_AUTH_SERVER_URL
      }/oauth/authorize?response_type=token&client_id=${
        process.env.VUE_APP_CLIENT_ID
      }&redirect_uri=${window.location.origin}/refresh`;
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
