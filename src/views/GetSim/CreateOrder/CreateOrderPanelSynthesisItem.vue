<template>
  <div v-if="item" class="synthesis-item">
    <h6>{{ $t(item.label) }}: </h6>
    <template v-if="isContentArray">
      <div :key="value" v-for="value in content">
        {{ value }}
      </div>
    </template>
    <p v-else-if="content">
      {{ content }}
    </p>
  </div>
</template>

<script>
import get from 'lodash/get';

export default {
  props: {
    item: {
      type: Object,
    },
  },
  computed: {
    content() {
      return get(this.item, 'value.content');
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
    font-weight: 500;
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
