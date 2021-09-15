<template>
  <li class="list-group-item finished-op">
    <span class="pending">
      <span class="label">
        {{ $t('export-types.' + operation.taskType) }}
      </span>
      <span v-if="!operation.downloadUri" class="op-status"> En cours </span>
      <a
        v-else
        href="#"
        :class="{ downloaded: isDownloaded }"
        @click.prevent="$emit('download', operation)"
      >
        <span v-if="isDownloaded"> {{ $t('actions.DOWNLOADED') }} </span>
        <span v-else> {{ $t('actions.DOWNLOAD') }} </span>

        <em v-if="isDownloaded" class="ic-Check-Icon" />
      </a>
    </span>
  </li>
</template>

<script>
export default {
  props: {
    isDownloaded: Boolean,
    operation: Object,
  },
};
</script>

<style lang="scss" scoped>
.pending {
  & .label {
    font-size: 1.2rem;
    font-weight: 560;
    color: $dark-gray;
  }
  & .op-status {
    font-weight: 700;
    color: $secondary;
  }
}

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

.finished-op {
  & a,
  & span {
    display: flex;
    justify-content: space-between;
    em {
      font-weight: bold;
      color: $success;
    }
  }
}
</style>
