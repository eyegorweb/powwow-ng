<template>
  <div>
    Redirecting ...
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

export default {
  name: 'AuthCallback',
  created() {
    const hashParts = this.$route.hash.split('=');
    this.setAuthToken(hashParts[1].split('&')[0]);
    this.fetchUserInfos();
    this.$router.push('/');
  },
  methods: {
    ...mapMutations(['setAuthToken']),
    ...mapActions(['fetchUserInfos']),
  },
};
</script>

<style scoped>
</style>
