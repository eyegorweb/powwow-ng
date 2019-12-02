<template>
  <div></div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'AuthCallback',
  async mounted() {
    // First token is loaded here
    const hashParts = this.$route.hash.split('=');
    this.setAuthToken(hashParts[1].split('&')[0]);
    await this.fetchUserInfos();
    const nextRoute = localStorage.getItem('_');
    if (nextRoute) {
      // _ = route avant la redirection
      localStorage.removeItem('_');
      this.$router.push(nextRoute);
    } else {
      this.$router.push('/');
    }
    this.appIsReady();
  },
  methods: {
    ...mapActions(['fetchUserInfos', 'setAuthToken']),
    ...mapMutations(['appIsReady']),
  },
};
</script>

<style scoped></style>
