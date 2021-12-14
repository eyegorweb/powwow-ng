<template>
  <div v-if="item" class="synthesis-item">
    <h6>{{ $t(item.label) }}:</h6>
    <template v-if="isContentArray">
      <div :key="value + '_key_' + index" v-for="(value, index) in content">
        {{ value }}
        <slot name="info" />
      </div>
    </template>
    <p v-else-if="content">
      {{ content }}
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
  computed: {
    content() {
      return this.$loGet(this.item, 'value.content');
    },
    isContentArray() {
      return Array.isArray(this.content);
    },
  },
};
</script>

<style scoped lang="scss">
$fontSize: 0.8rem;

.synthesis-item {
  margin-bottom: 1rem;
  h6 {
    color: $gray-680;
    font-size: $fontSize;
    font-weight: 800;
  }

  p {
    font-size: $fontSize;
    margin: 0;
  }

  div {
    font-size: $fontSize;
  }
}
</style>
