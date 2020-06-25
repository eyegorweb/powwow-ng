<template>
  <div class="toggles-container">
    <div class="single-toggle" :class="sizeClass" :key="service.code" v-for="service in services">
      <UiToggle
        v-if="service.visible"
        :label="service.labelService"
        :editable="service.editable"
        :bold-label="isChanged(service)"
        v-model="service.checked"
        small-label
      />
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash.clonedeep';
import UiToggle from '@/components/ui/UiToggle';

export default {
  props: {
    services: Array,
    size: Number, // size in columns
  },
  components: {
    UiToggle,
  },
  mounted() {
    this.initialServices = cloneDeep(this.services);
  },
  computed: {
    sizeClass() {
      if (this.size === 3) {
        return 'third-size';
      }

      return 'demi-size';
    },
  },
  methods: {
    onServiceChange(values) {
      console.log(values);
    },
    revertServices() {
      this.services = cloneDeep(this.initialServices);
    },
    isChanged(service) {
      if (!this.initialServices || !this.initialServices.length) return false;
      const initialService = this.initialServices.find(s => s.code === service.code);
      return initialService.checked !== service.checked;
    },
  },
};
</script>

<style lang="scss" scoped>
.third-size {
  width: 33%;
}

.demi-size {
  width: 50%;
}

.toggles-container {
  display: flex;
  flex-flow: row wrap;
  width: 100%;

  .single-toggle {
    min-height: 3rem;
  }
}
</style>
