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
      <a
        v-if="operation.finished"
        href="#"
        :class="{ downloaded: isDownloaded }"
        @click.prevent="dismissOperation"
      >
        <span v-if="clicked"> {{ $t('pending-actions.acquited') }} </span>
        <span v-else>{{ $t('pending-actions.acquit') }}</span>

        <em v-if="clicked" class="ic-Check-Icon" />
      </a>
      <span v-else>
        <span v-if="!canCancel" class="op-status"
          >{{ $t('getreport.report_statut.RUNNING') }}.&nbsp;{{
            $t('pending-actions.cancelQuestion')
          }}
          <a href="#" @click.prevent="canCancel = true">{{ $t('common.YES') }}</a>
        </span>

        <a
          v-if="canCancel"
          href="#"
          :class="{ downloaded: isDownloaded }"
          @click.prevent="dismissOperation"
        >
          <span v-if="clicked">
            {{ $t('getreport.report_statut.CANCELED') }}
          </span>
          <span v-else>{{ $t('getreport.report_statut.CANCEL') }}</span>

          <em v-if="clicked" class="ic-Check-Icon" />
        </a>
      </span>
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
