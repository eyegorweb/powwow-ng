<template>
  <div class="d-flex flex-column">
    <div>
      <CheckMarkText :state="stateValue">{{ $t(label) }}</CheckMarkText>
    </div>
    <div class="value-str">
      {{ value }}
    </div>
  </div>
</template>

<script>
import CheckMarkText from '@/components/CheckMarkText';

export default {
  components: {
    CheckMarkText,
  },
  props: {
    success: Boolean,
    label: String,
    value: String,
  },

  computed: {
    stateValue() {
      return this.success ? 'SUCCESS' : 'ERROR';
    },
  },
};
</script>

<style lang="scss" scoped>
.value-str {
  padding-left: 2rem;
}
</style>
