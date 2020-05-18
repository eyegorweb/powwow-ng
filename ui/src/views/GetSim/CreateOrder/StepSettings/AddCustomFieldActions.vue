<template>
  <div slot="footer" class="action-buttons">
    <div>
      <UiButton @click="$emit('cancel')" variant="outline-primary" block class="float-left">
        {{ $t('cancel') }}
      </UiButton>
    </div>
    <div>
      <UiButton
        @click="$emit('add-field')"
        :disabled="!canSend"
        :variant="canSend ? 'primary' : 'outline-simple'"
        class="float-right"
        block
      >
        {{ text }}
      </UiButton>
    </div>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';

export default {
  components: {
    UiButton,
  },

  props: {
    canSend: Boolean,
    text: String,
  },
};
</script>

<style lang="scss" scoped>
.action-buttons {
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
  div {
    flex: 1;
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
