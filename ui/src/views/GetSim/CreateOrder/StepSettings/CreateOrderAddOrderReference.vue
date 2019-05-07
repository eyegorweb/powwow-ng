<template>
  <div>
    <h3 class="font-weight-light text-center mt-4 mb-4">{{ $t('orders.choose-reference') }}</h3>
    <UiInput class="d-block" v-model="referenceValue" :error="checkForError || undefined" />
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';

export default {
  props: {
    value: String,
    checkForError: {
      type: String,
    },
  },
  computed: {
    referenceValue: {
      get() {
        return this.value;
      },
      set(newReference) {
        this.$emit('input', newReference);
      },
    },
  },
  components: {
    UiInput,
  },
};
</script>

<style lang="scss" scoped>
.title {
  background-color: transparent;
  color: $dark-gray;
  font-weight: 300;
  font-size: 2rem;
  margin: 3rem 0 1.875rem;
  padding: 0;
  text-align: center;
}
</style>
