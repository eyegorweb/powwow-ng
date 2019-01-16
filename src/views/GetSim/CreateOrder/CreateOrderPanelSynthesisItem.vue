<template>
  <div v-if="item" class="synthesis-item">
    <h6>{{ $t(item.label) }}: </h6>
    <p v-if="item.value">
      {{ item.value.label }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
    },
  },
};
</script>

<style scoped lang="scss">
.synthesis-item {
  margin-bottom: 1rem;
  h6 {
    color: $gray-680;
    font-size: 0.8em;
    font-weight: 500;
  }

  p {
    font-size: 1rem;
    margin: 0;
  }
}
</style>
