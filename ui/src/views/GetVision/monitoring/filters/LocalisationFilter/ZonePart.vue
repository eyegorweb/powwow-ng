<template>
  <div>
    <div class="mb-3">
      <UiToggle label="Monde" v-model="world" />
    </div>
    <div class="mb-3">
      <UiToggle label="France" v-model="france" />
    </div>
  </div>
</template>

<script>
import UiToggle from '@/components/ui/UiToggle';

export default {
  components: {
    UiToggle,
  },

  props: {
    value: Object,
  },

  computed: {
    world: {
      get() {
        if (!this.value) return false;
        return this.value.world;
      },
      set(value) {
        this.$emit('input', { world: value, france: !value });
      },
    },

    france: {
      get() {
        if (!this.value) return false;
        return this.value.france;
      },
      set(value) {
        this.$emit('input', { france: value, world: !value });
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
