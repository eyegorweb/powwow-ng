<template>
  <div>
    <div v-if="content.length <= limit">
      <span>{{ items.join(', ') }}</span>
    </div>
    <div v-else>
      <div v-tooltip="items.join('\n')">
        {{ items.slice(0, 2).join(', ') }}
        <template v-if="items.length > 2">... </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
    items() {
      return this.content.split(',');
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
  &:focus,
  &:active {
    outline: none !important;
  }

  &.see-more {
    font-size: 22px;
  }
}
</style>
