<template>
  <div v-if="item" class="synthesis-item">
    <h6>{{ $t(item.label) }}: </h6>
    <p v-if="stringValue">
      {{ item.value.content }}
    </p>
    <div :key="value" v-for="value in arrayValues">
      {{ value }}
    </div>
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
    stringValue() {
      if (this.item && this.item.value && typeof this.item.value.content === 'string') {
        return this.item.value.content;
      }
    },
    arrayValues() {
      if (this.item && this.item.value && Array.isArray(this.item.value.content)) {
        return this.item.value.content;
      }
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
