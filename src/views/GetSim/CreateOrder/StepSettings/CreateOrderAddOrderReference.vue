<template>
  <div>
    <h2 class="title">{{ $t('orders.choose-reference') }}</h2>
    <div class="subcontainer">
      <UiInput class="d-block" v-model="referenceValue" />
    </div>
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';

export default {
  props: {
    value: String,
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
.subcontainer {
  width: 65%;
  margin: 0 auto;
}
</style>
