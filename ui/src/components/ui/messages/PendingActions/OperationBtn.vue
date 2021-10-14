<template>
  <div>
    <template v-if="isExport">
      <template v-if="isFinished">
        <a href="#" :class="{ downloaded: isDownloaded }" @click.prevent="dismissOperation">
          <span v-if="isDownloaded"> {{ $t('actions.DOWNLOADED') }} </span>
          <span v-else> {{ $t('actions.DOWNLOAD') }} </span>

          <em v-if="isDownloaded" class="ic-Check-Icon" />
        </a>
      </template>
      <template v-else>
        <span> {{ $t('pending-actions.pending') }} </span>
      </template>
    </template>

    <template v-else>
      <a href="#" :class="{ downloaded: clicked }" @click.prevent="dismissOperation">
        <span v-if="clicked"> {{ $t('pending-actions.acquited') }} </span>
        <span v-else>{{ $t('pending-actions.acquit') }}</span>

        <em v-if="clicked" class="ic-Check-Icon" />
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

  data() {
    return {
      clicked: false,
      canCancel: false,
    };
  },

  computed: {
    isExport() {
      return this.operation.taskType.startsWith('EXPORT_');
    },
    isAct() {
      return this.operation.taskType.startsWith('ACT_');
    },
    isFinished() {
      return this.operation.finished;
    },
  },

  methods: {
    dismissOperation() {
      if (this.isExport) {
        this.$emit('download', this.operation);
      }
      if (this.isAct) {
        this.clicked = true;
      }
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
