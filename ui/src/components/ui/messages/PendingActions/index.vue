<template>
  <div>
    <div class="pending-messages" v-if="pendingOperations.length" @click="showModal = true">
      <div class="peding-download">
        <div class="alert alert-dark" role="alert">
          <template v-if="!interrupted">
            <template v-if="pendingOperations.length && !allFinished">
              {{ $t('pending-actions.preparing') }}
            </template>
            <template v-if="pendingOperations.length && allFinished">
              {{ $t('pending-actions.ready') }}
            </template>
            <template v-if="pendingOperations.length > 1">
              {{ finishedOperations.length }}/{{ pendingOperations.length }}
            </template>
          </template>
          <template v-else>
            {{ $t('pending-actions.expired') }}
          </template>
        </div>
      </div>
    </div>

    <Modal v-if="showModal">
      <div slot="body">
        <h4>{{ $t('pending-actions.title') }}</h4>

        <div class="scrollable-content">
          <ul class="list-group">
            <SingleOperation
              :key="op.downloadUri"
              v-for="op in pendingOperations"
              :operation="op"
              @download="(op) => downloadFile(op.downloadUri)"
              :is-downloaded="isDownloaded(op.downloadUri)"
            />
          </ul>
        </div>
      </div>
      <div slot="footer">
        <button class="modal-default-button btn btn-danger btn-sm" @click.stop="closeModal">
          {{ $t('close') }}
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { fetchPendingOperations } from '@/api/pendingOperations.js';
import Modal from '@/components/Modal';
import { mapState, mapMutations } from 'vuex';
import { getBaseURL } from '@/utils.js';
import { delay } from '@/api/utils.js';
import SingleOperation from './SingleOperation.vue';

export default {
  components: {
    Modal,
    SingleOperation,
  },
  async mounted() {
    await this.refreshOperations();
    if (!this.allFinished) {
      await delay(1200);
      this.startWatching();
    }
  },
  data() {
    return {
      pendingOperations: [],
      alreadyDownloaded: [],
      showModal: false,
      pingCounter: 0,

      intervalCheck: undefined,
      interrupted: false,
    };
  },
  methods: {
    ...mapMutations(['startDownload', 'setPendingExportsStatus']),

    async refreshOperations() {
      this.pendingOperations = await fetchPendingOperations();

      if (this.pendingOperations.length === 0) {
        this.stopWatching();
      }
    },
    startWatching() {
      const reevaluateIntervalAndWatch = () => {
        if (this.intervalCheck) {
          clearInterval(this.intervalCheck);
        }

        let watchInterval = 5 * 1000;
        if (this.pingCounter >= 10 && this.pingCounter < 20) {
          watchInterval = 30 * 1000;
        }

        if (this.pingCounter > 20) {
          if (this.intervalCheck) {
            clearInterval(this.intervalCheck);
          }
          this.interrupted = true;
        }

        if (!this.interrupted) {
          this.intervalCheck = setInterval(() => {
            this.refreshOperations();
            this.pingCounter += 1;
            reevaluateIntervalAndWatch();
          }, watchInterval);
        }
      };

      reevaluateIntervalAndWatch();
    },
    resumeWatch() {
      this.interrupted = false;
      this.pingCounter = 0;
      this.startWatching();
    },
    stopWatching() {
      if (this.intervalCheck) {
        clearInterval(this.intervalCheck);
        this.pingCounter = 0;
        this.interrupted = false;
      }
    },
    async onFinished() {
      console.log('onFinished');
      this.stopWatching();

      if (this.pendingOperations.length === 1 && this.allFinished) {
        this.downloadFile(this.pendingOperations[0].downloadUri);
        this.pendingOperations = [];
        this.alreadyDownloaded = [];
        this.setPendingExportsStatus(false);
      }
    },

    downloadFile(downloadUri) {
      this.alreadyDownloaded.push(downloadUri);
      this.startDownload(getBaseURL() + downloadUri);
    },

    isDownloaded(uri) {
      return !!this.alreadyDownloaded.find((o) => o === uri);
    },

    closeModal() {
      this.refreshOperations();
      this.showModal = false;

      if (
        this.alreadyDownloaded.length &&
        this.pendingOperations.length &&
        this.alreadyDownloaded.length >= this.pendingOperations.length
      ) {
        this.pendingOperations = [];
        this.alreadyDownloaded = [];
        this.setPendingExportsStatus(false);
      }
    },
  },
  computed: {
    ...mapState({
      havePendingExports: (state) => state.ui.havePendingExports,
    }),
    finishedOperations() {
      return this.pendingOperations.filter((p) => !!p.downloadUri);
    },
    allFinished() {
      return (
        !!this.pendingOperations.length &&
        this.pendingOperations.length === this.finishedOperations.length
      );
    },
  },
  watch: {
    havePendingExports(newValue, oldValue) {
      if (newValue && !oldValue) {
        this.refreshOperations();

        this.interrupted = false;
        this.pingCounter = 0;
        this.startWatching();
      }

      if (newValue && oldValue) {
        this.interrupted = false;
        this.pingCounter = 0;
        this.startWatching();
      }
    },
    allFinished(newValue) {
      if (newValue) {
        this.onFinished();
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
  animation: slide-up 0.2s ease;
  transition: opacity 0.3s linear;
}

.alert-dark {
  background-color: black;
  color: white;
  font-weight: bold;
}

.finished-op {
  & a {
    display: flex;
    justify-content: space-between;
    em {
      font-weight: bold;
      color: $success;
    }
  }
}

.peding-download {
  &:hover {
    cursor: pointer;
  }
}

.scrollable-content {
  max-height: 17rem;
  overflow-y: scroll;
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
