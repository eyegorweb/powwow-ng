<template>
  <div class="row mb-3">
    <div class="col">
      <div class="step-title">
        <h4>
          <span class="badge badge-pill badge-secondary">{{ num }}</span>
          <span class="text">{{ $t(title) }}</span>
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    num: String,
    title: String,
  },
};
</script>

<style lang="scss" scoped></style>
