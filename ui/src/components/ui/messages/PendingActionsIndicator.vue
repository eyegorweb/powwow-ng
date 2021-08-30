<template>
  <div class="pending-messages">
    <div v-if="havePendingExports" class="peding-download">
      <div class="alert alert-dark" role="alert">Préparation de l'export ...</div>
    </div>

    {{ nextToDownloadIndex }}
    <DownloadOneFile
      v-for="(op, index) in filesReadyForDownload"
      :canDownload="index === nextToDownloadIndex"
      @finished="finishedOneDownload(op, index)"
      :key="op.downloadUri"
      :uri="op.downloadUri"
    />
  </div>
</template>

<script>
import { fetchPendingOperations } from '@/api/pendingOperations.js';
import { mapMutations, mapState } from 'vuex';
import { getBaseURL } from '@/utils.js';
import DownloadOneFile from './DownloadOneFile.vue';

export default {
  components: {
    DownloadOneFile,
  },
  data() {
    return {
      isProcessing: false,

      pendingOperations: [],
      filesReadyForDownload: [],
      nextToDownloadIndex: 0,

      downloadingReadyFiles: false,
    };
  },
  async mounted() {
    this.refreshOperations();
  },
  computed: {
    ...mapState({
      havePendingExports: (state) => state.ui.havePendingExports,
    }),
  },
  watch: {
    havePendingExports(newValue, oldValue) {
      if (newValue && !oldValue) {
        this.refreshOperations();
      }
    },
  },
  methods: {
    ...mapMutations(['startDownload', 'setPendingExportsStatus']),

    finishedOneDownload(op, index) {
      this.nextToDownloadIndex += 1;

      // if last one
      if (!this.filesReadyForDownload[this.nextToDownloadIndex]) {
        this.downloadingReadyFiles = false;
        this.setPendingExportsStatus(false);
        // this.refreshOperations();
      }
    },
    async refreshOperations2() {
      if (this.downloadingReadyFiles) return;

      this.pendingOperations = await fetchPendingOperations();
      if (this.pendingOperations && this.pendingOperations.length) {
        this.nextToDownloadIndex = 0;
        const readyFiles = this.pendingOperations.filter((p) => !!p.downloadUri);
        if (readyFiles && readyFiles.length) {
          this.downloadingReadyFiles = !!readyFiles.length;
          this.filesReadyForDownload = readyFiles;
        } else {
          //  setTimeout(() => this.refreshOperations(), 500);
        }
      }
    },
    async refreshOperations() {
      const pendingOperations = await fetchPendingOperations();
      if (pendingOperations && pendingOperations.length) {
        this.isProcessing = true;
        this.setPendingExportsStatus(true);
        const readyFiles = pendingOperations.filter((p) => !!p.downloadUri);
        if (readyFiles.length) {
          this.startDownload(getBaseURL() + readyFiles[0].downloadUri);
        }
        setTimeout(() => this.refreshOperations(), 500);
      } else {
        this.isProcessing = false;
        this.setPendingExportsStatus(false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pending-messages {
  position: fixed;
  bottom: 0;
  left: 10px;
  animation: slide-up 1.5s ease;
  transition: opacity 2s linear;
}

.alert-dark {
  background-color: black;
  color: white;
  font-weight: bold;
}

@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>
