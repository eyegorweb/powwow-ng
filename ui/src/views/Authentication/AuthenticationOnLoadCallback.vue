<template>
  <div></div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'AuthCallback',
  async mounted() {
    console.log('AuthCallback');
    // vérifier si l'url est appelée à l'intérieur de l'iframe de refresh du token
    if (!window.frameElement) {
      // First token is loaded here
      const hashParts = this.$route.hash.split('=');
      this.setAuthToken(hashParts[1].split('&')[0]);
      await this.fetchUserInfos();
      console.log('route': , this.$route);
      const nextRoute = this.$loGet(this.$route, 'query.prev');
      this.redirectTo(nextRoute || '/');
      this.appIsReady();
    }
  },
  methods: {
    ...mapActions(['fetchUserInfos', 'setAuthToken']),
    ...mapMutations(['appIsReady']),

    redirectTo(nextRoute) {
      const next = this.$router.push(nextRoute);
      if (next) {
        next.catch(() => {});
      }
    },
  },
};
</script>

<style scoped></style>
