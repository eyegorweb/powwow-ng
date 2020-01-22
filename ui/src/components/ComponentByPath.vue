<template>
  <div>
    {{ path }}
    <component :key="'cmp_' + path" v-if="path && component" :is="component" v-bind="payload" />
  </div>
</template>

<script>
export default {
  props: {
    path: String,
    payload: Object,
  },

  data() {
    return {
      component: undefined,
    };
  },

  watch: {
    path() {
      this.refreshComponent();
    },
  },

  methods: {
    refreshComponent() {
      if (!this.path) return;

      const componentLoader = () => import('' + this.path);
      console.log('compo >', this.path, componentLoader);

      if (componentLoader) {
        componentLoader()
          .then(() => {
            this.component = () => componentLoader();
          })
          .catch(() => {
            this.component = undefined;
          });
      } else {
        this.component = undefined;
      }
    },
  },

  mounted() {
    this.refreshComponent();
  },
};
</script>

<style lang="scss" scoped></style>
