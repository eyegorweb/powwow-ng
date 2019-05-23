<template>
  <div>
    Redirecting ...
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AuthCallback',
  async created() {
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
  },
  methods: {
    ...mapActions(['fetchUserInfos', 'setAuthToken']),
  },
};
</script>

<style scoped></style>
