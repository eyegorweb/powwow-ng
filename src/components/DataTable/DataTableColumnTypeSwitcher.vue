<template>
  <div>
    <template v-if="!format">{{ item }}</template>
    <component
      v-else-if="component"
      :is="component"
      :format="format"
      :item="item"
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
      type: [Object, String, Number],
    },
  },
  data() {
    return {
      component: null,
    };
  },
  methods: {
    getComponentLoader() {
      if (!this.format || !this.format.type) {
        return null;
      }
      return () => import(`@/components/DataTable/ColumnTypes/${this.format.type}`);
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
