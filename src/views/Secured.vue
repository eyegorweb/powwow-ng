<template>
  <div>
    Secured
    <iframe
      src="http://localhost:8084/oauth/authorize?response_type=token&client_id=nextgenui-implicit&redirect_uri=http://localhost:8080/callback"
      @load="onRedirect"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'SecuredArea',
  methods: {
    ...mapActions(['authorize']),
    onRedirect(frame) {
      console.log(
        'Redirecting ',
        frame.target.contentDocument.location.href.split('=')[1].split('&')[0]
      );
    },
  },

  created() {
    /*
    this.authorize().catch(e => {
      console.log('>>>', e);
    });
    //*/
  },
};
</script>

<style scoped>
</style>
