<template>
  <li class="list-group-item finished-op">
    <div>
      <span class="pending">
        <span class="label">
          {{ $t('export-types.' + operation.taskType) }}
        </span>
        <OperationBtn
          :is-downloaded="isDownloaded"
          :operation="operation"
          @dismissed="$emit('dismissed', $event)"
          @download="$emit('download', $event)"
        />
      </span>
    </div>
    <div>
      <OperationMessage :operation="operation" />
    </div>
  </li>
</template>

<script>
import OperationBtn from './OperationBtn.vue';
import OperationMessage from './OperationMessage.vue';

export default {
  components: {
    OperationBtn,
    OperationMessage,
  },
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
