<template>
  <div>
    <span> {{ text }}</span>
    <button
      v-if="displaysTruncatedText"
      class="see-less"
      @click="displaysTruncatedText = !displaysTruncatedText"
    >
      -
    </button>
    <button v-else class="see-more" @click="displaysTruncatedText = !displaysTruncatedText">
      +
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      displaysTruncatedText: false,
    };
  },
  props: {
    limit: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  computed: {
    text() {
      return this.displaysTruncatedText
        ? this.content
        : this.content.substring(0, this.limit) + ' ...';
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  outline: 0;
  border: 0;
  background-color: transparent;
  color: $secondary;
  font-weight: bold;
  font-size: 28px;
}
</style>
