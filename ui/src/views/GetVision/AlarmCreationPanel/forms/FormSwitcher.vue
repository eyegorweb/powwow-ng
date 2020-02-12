<template>
  <div>
    <component :key="'form_' + alarm.id" v-if="alarm && component" :is="component" :alarm="alarm" />
  </div>
</template>

<script>
export default {
  props: {
    alarm: Object,
  },

  data() {
    return {
      component: undefined,
    };
  },

  watch: {
    alarm() {
      this.refreshComponent();
    },
  },

  methods: {
    refreshComponent() {
      if (!this.alarm) return;

      const componentLoader = () =>
        import(`@/views/GetVision/AlarmCreationPanel/forms/${this.alarm.id}.vue`);

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
