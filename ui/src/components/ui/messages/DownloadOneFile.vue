<template>
  <div></div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import { getBaseURL } from '@/utils.js';

export default {
  props: {
    uri: String,
    canDownload: Boolean,
  },

  data() {
    return {
      finished: false,
    };
  },

  computed: {
    ...mapState({
      downloadURI: (state) => state.ui.downloadURI,
    }),
  },

  watch: {
    downloadURI(newValue, oldValue) {
      if (!newValue && oldValue) {
        this.finished = true;
        this.$emit('finished');
      }
    },

    canDownload(newValue) {
      if (newValue) {
        this.doDownload();
      }
    },
  },

  methods: {
    ...mapMutations(['startDownload']),

    doDownload() {
      if (this.uri) {
        this.startDownload(getBaseURL() + this.uri);
      }
    },
  },

  mounted() {
    if (this.canDownload) {
      this.doDownload();
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
