<template>
  <div class="row mb-3">
    <div class="col">
      <div class="step-title" :class="[color ? color : '']">
        <h4>
          <span class="badge badge-pill badge-secondary">{{ num }}</span>
          <span class="text" :class="{ 'text-uppercase': uppercase }">{{ $t(title) }}</span>
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
    color: String,
    uppercase: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.step-title.blue {
  .text {
    color: $blue;
  }

  .badge-secondary {
    background-color: $blue;
  }
}
.step-title.orange {
  .text {
    color: $orange;
  }

  .badge-secondary {
    background-color: $orange;
  }
}
</style>
