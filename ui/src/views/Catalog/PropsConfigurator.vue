<template>
  <div>
    <template v-if="cmpProps">
      <SinglePropConfig
        v-for="cmpProp in cmpProps"
        :ptype="cmpProp.type"
        :label="cmpProp.label"
        :initValue="getInitValue(cmpProp.label)"
        @change="onPropChange($event, cmpProp)"
      />
    </template>
  </div>
</template>

<script>
import SinglePropConfig from './SinglePropConfig';
export default {
  components: {
    SinglePropConfig,
  },
  props: {
    config: Object,
    initialValues: Object,
  },
  data() {
    return {
      testConfig: undefined,
      cmpProps: [],
      propValues: {},
    };
  },
  async mounted() {
    await this.refresh();

    // bug pour detecter le type Boolean
    setTimeout(async () => {
      await this.refresh();
    });
  },
  watch: {
    async config() {
      await this.refresh();
    },
  },
  methods: {
    getInitValue(key) {
      if (this.initialValues) {
        return this.initialValues[key];
      }
      return undefined;
    },
    onPropChange(value, cmpProp) {
      this.propValues[cmpProp.label] = value;
      this.$emit('change', this.propValues);
    },
    async refresh() {
      this.cmpProps = undefined;
      const fixture = this.config.fixture;
      const conf = await fixture.conf();
      const component = await conf.default.component();

      const cmpProps = [];

      for (let key in component.default.props) {
        let cmpType = 'Object';
        if (Array.isArray(component.default.props[key].type)) {
          cmpType = 'Array';
        }

        if (component.default.props[key].type && component.default.props[key].type.name) {
          cmpType = component.default.props[key].type.name;
        }

        cmpProps.push({
          label: key,
          type: cmpType,
        });
      }

      this.cmpProps = cmpProps;
    },
  },
};
</script>

<style lang="scss" scoped></style>
