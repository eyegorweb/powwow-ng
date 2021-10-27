<template>
  <div class="d-flex flex-row-reverse">
    <slot name="nextBtn">
      <button class="btn btn-primary" v-if="!noNext" :disabled="!canNext" @click="$emit('next')">
        Next
      </button>
    </slot>
    <slot name="prevBtn">
      <button
        class="btn btn-primary mr-1"
        v-if="!noPrev"
        :disabled="!canPrev"
        @click="$emit('prev')"
      >
        Prev
      </button>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    noPrev: Boolean,
    canPrev: Boolean,
    canNext: Boolean,
    noNext: Boolean
  },
}
</script>

<style lang="scss" scoped>

</style>
