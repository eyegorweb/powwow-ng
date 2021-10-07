<template>
  <div>
    <template v-if="isExport">
      <a href="#" :class="{ downloaded: isDownloaded }" @click.prevent="dismissOperation">
        <span v-if="isDownloaded"> {{ $t('actions.DOWNLOADED') }} </span>
        <span v-else> {{ $t('actions.DOWNLOAD') }} </span>

        <em v-if="isDownloaded" class="ic-Check-Icon" />
      </a>
    </template>
    <template v-else>
      <a href="#" :class="{ downloaded: isDownloaded }" @click.prevent="dismissOperation">
        <span>{{ $t('pending-actions.acquit') }}</span>
      </a>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    isDownloaded: Boolean,
    operation: Object,
  },

  computed: {
    isExport() {
      return this.operation.taskType.startsWith('EXPORT_');
    },
  
  },

  methods: {
    dismissOperation() {
      if (this.isExport) {
        this.$emit('download', this.operation);
      }
      console.log('appel api pour supprimer du cache ', this.operation.requestId);
      this.$emit('dismissed', this.operation);
    },
  },
};
</script>

<style lang="scss" scoped>
.downloaded {
  &:hover,
  &:active,
  &:focus {
    text-decoration: none;
  }
  span {
    font-weight: bold;
  }

  em {
    padding-left: 0.6rem;
  }
}
</style>
