<template>
  <div class="p-4 viewer-container">
    <div class="view-section">
      <component
        :key="'v_' + version"
        v-if="component"
        :is="component"
        v-bind="values"
        v-model="dummyValue"
      />
    </div>
    <div>
      <textarea v-model="txtValues" class="form-control" rows="3"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: Object,
    values: Object,
  },
  data() {
    return {
      component: undefined,
      version: 0,
      dummyValue: undefined,
    };
  },
  watch: {
    values() {
      this.version += 1;
    },
    config() {
      this.version += 1;
    },
  },
  computed: {
    txtValues() {
      return JSON.stringify(this.values);
    },
  },
  async mounted() {
    const fixture = this.config.fixture;
    const conf = await fixture.conf();
    this.component = await conf.default.component;
  },
};
</script>

<style lang="scss" scoped>
.viewer-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.view-section {
  flex-grow: 1;
}
</style>
