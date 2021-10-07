<template>
  <div>
    <div v-if="isSuccess" class="alert-message-success" role="alert">
      {{ $t('pending-actions.actId', {id:operation.successMessage}) }}
    </div>
    <div v-if="isError" class="alert-message-ko" role="alert">
      KO: {{ operation.errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    operation: Object,
  },
  computed: {
    isSuccess() {
      const isExport = this.operation.taskType.startsWith('EXPORT_');
      return !isExport && this.operation.finished && !this.operation.errorMessage;
    },
    isError() {
      return this.operation.finished && !!this.operation.errorMessage;
    },
  },
}
</script>

<style lang="scss" scoped>
.alert-message-success {
 color: $success;
}

.alert-message-ko {
 color: $orange;
}

</style>
