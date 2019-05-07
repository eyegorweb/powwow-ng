<template>
  <div>
    <div v-if="content.length <= limit">
      <span> {{ content }}</span>
    </div>
    <div v-else>
      <span> {{ text }}</span>
      <button
        v-if="displaysTruncatedText"
        class="see-less"
        @click="displaysTruncatedText = !displaysTruncatedText"
      >
        &nbsp;-
      </button>
      <button v-else class="see-more" @click="displaysTruncatedText = !displaysTruncatedText">
        &nbsp;+
      </button>
    </div>
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
  display: inline;
  outline: 0;
  border: 0;
  background-color: transparent;
  color: $secondary;
  font-weight: bold;
  font-size: 28px;

  &.see-more {
    font-size: 22px;
  }
}
</style>
