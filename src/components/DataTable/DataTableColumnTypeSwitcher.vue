<template>
  <div>
    <template v-if="!format">{{ item }}</template>
    <component
      v-else-if="component"
      :is="component"
      :format="format"
      :item="item"
      :row="row"
    />
  </div>
</template>
<script>
export default {
  name: 'DatatableColumnTypeSwitcher',
  props: {
    format: {
      type: Object,
      required: false,
    },
    item: {
      type: [Object, String, Number, Array, Boolean],
    },
    row: Object,
  },
  data() {
    return {
      component: null,
    };
  },
  methods: {
    getComponentLoader() {
      if (!this.format) {
        return null;
      }

      if (this.format.component) {
        return () => Promise.resolve(this.format.component);
      }

      if (this.format.type) {
        return () => import(`@/components/DataTable/ColumnTypes/${this.format.type}`);
      }
    },
  },
  mounted() {
    const componentLoader = this.getComponentLoader();
    if (componentLoader) {
      componentLoader().then(() => {
        this.component = () => componentLoader();
      });
    }
  },
};
</script>
