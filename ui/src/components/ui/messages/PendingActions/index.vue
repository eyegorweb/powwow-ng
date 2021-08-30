<template>
  <div>
    <div class="pending-messages" v-if="pendingOperations.length" @click="showModal = true">
      <div class="peding-download">
        <div class="alert alert-dark" role="alert">
          <template v-if="pendingOperations.length && !allFinished">
            Préparation de l'export ...
          </template>
          <template v-if="pendingOperations.length && allFinished"> Export prêt </template>
          <template v-if="pendingOperations.length > 1">
            {{ finishedOperations.length }}/{{ pendingOperations.length }}
          </template>
        </div>
      </div>
    </div>

    <Modal v-if="showModal">
      <div slot="body">
        <h4>Vos fichiers sont prêts</h4>

        <ul class="list-group">
          <li
            class="list-group-item finished-op"
            :key="op.downloadUri"
            v-for="op in finishedOperations"
          >
            <a href="#" @click.prevent="downloadFile(op.downloadUri)">
              {{ op.downloadUri }}
              <em v-if="isDownloaded(op.downloadUri)" class="ic-Check-Icon" />
            </a>
          </li>
        </ul>
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
import { mapState, mapMutations, mapGetters } from 'vuex';
import { getBaseURL } from '@/utils.js';
import { delay } from '@/api/utils.js';

export default {
  components: {
    Modal,
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

      intervalCheck: undefined,
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
      this.intervalCheck = setInterval(() => {
        this.refreshOperations();
      }, 1000);
    },
    stopWatching() {
      if (this.intervalCheck) {
        clearInterval(this.intervalCheck);
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
