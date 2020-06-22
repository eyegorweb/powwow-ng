<template>
  <div class="download-manager">
    <iframe name="download_frame"></iframe>

    <template v-if="accessToken && downloadURI">
      <form ref="download_form" :action="downloadURI" method="post" target="download_frame">
        <input type="text" name="access_token" :value="accessToken" />
      </form>
    </template>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import { delay } from '@/api/utils.js';

export default {
  data() {
    return {
      version: 0,
    };
  },
  computed: {
    ...mapState({
      downloadURI: state => state.ui.downloadURI,
    }),
    ...mapGetters(['accessToken']),
  },

  methods: {
    ...mapMutations(['startDownload']),
    getReadyForNextDownload() {
      this.startDownload(null);
    },
    async doDownload() {
      await delay(0);
      this.$refs.download_form.submit();
      await delay(200);
      this.getReadyForNextDownload();
    },
  },

  watch: {
    downloadURI(uri) {
      if (uri) {
        this.doDownload();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.download-manager {
  display: none;
}
</style>
