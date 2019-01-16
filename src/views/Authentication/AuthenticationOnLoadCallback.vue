<template>
  <div>
    Redirecting ...
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AuthCallback',
  created() {
    const hashParts = this.$route.hash.split('=');
    this.setAuthToken(hashParts[1].split('&')[0]);
    this.fetchUserInfos();
    this.$router.push('/');
  },
  methods: {
    ...mapActions(['fetchUserInfos', 'setAuthToken']),
  },
};
</script>

<style scoped>
</style>
