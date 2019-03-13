<template>
  <div class="input-group position-relative">
    <input
      class="form-control border-right-0 h-100"
      :type="type"
      ref="start"
      v-model="fromValue"
      onClick="this.select();"
    />
    <i class="icon ic-Arrow-Right-Icon position-absolute" />
    <input
      class="form-control border-left-0 h-100"
      :type="type"
      ref="end"
      v-model="toValue"
      onClick="this.select();"
    />
  </div>
</template>

<script>
export default {
  props: {
    from: {
      type: [Number, String],
    },
    to: {
      type: [Number, String],
    },
    type: {
      type: String,
      required: false,
      default: 'text',
    },
  },
  computed: {
    fromValue: {
      get() {
        return this.from;
      },
      set(value) {
        this.$emit('change', {
          from: value,
          to: this.to,
        });
      },
    },
    toValue: {
      get() {
        return this.to;
      },
      set(value) {
        this.$emit('change', {
          from: this.from,
          to: value,
        });
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';

.icon {
  color: $gray-700;
  left: 50%;
  top: 50%;
  z-index: 10;
  transform: translate(-50%, -50%);
}

.form-control:focus {
  color: $secondary;
  box-shadow: none;
}
</style>
