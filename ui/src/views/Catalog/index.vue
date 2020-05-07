<template>
  <div class="row">
    <div class="col-3 menu-bar pt-3">
      <h6>Composant</h6>
      <UiApiAutocomplete :items="fixtures" v-model="activeFixture" display-results-while-empty />

      <template v-if="sets && sets.length">
        <h6>Jeux de test</h6>
        <UiApiAutocomplete :items="sets" v-model="activeSet" display-results-while-empty />
      </template>

      <hr />

      <PropsConfigurator
        :key="'conf' + confVersion"
        v-if="activeFixture && activeFixture.id"
        :initialValues="activeSetValues"
        :config="activeFixture"
        @change="onPropsChange"
      />
    </div>
    <div class="col-9">
      <ComponentViewer
        v-if="activeFixture && activeFixture.id"
        :config="{ ...activeFixture }"
        :values="propValues"
      />
    </div>
  </div>
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import PropsConfigurator from './PropsConfigurator';
import ComponentViewer from './ComponentViewer';

import fixtures from './fixtures/all';
export default {
  components: {
    UiApiAutocomplete,
    PropsConfigurator,
    ComponentViewer,
  },

  data() {
    return {
      activeFixture: undefined,
      fixtures: [],

      // Sets de tests
      sets: [],
      activeSet: undefined,
      propValues: undefined,

      confVersion: 0,
    };
  },
  computed: {
    activeSetValues() {
      if (this.activeSet && this.activeSet.values) {
        return this.activeSet.values;
      }
      return undefined;
    },
  },
  watch: {
    activeSet(activeSet) {
      if (activeSet && activeSet.values) {
        this.confVersion += 1;
        this.propValues = { ...activeSet.values };
      }
    },
    async activeFixture() {
      this.propValues = undefined;
      this.activeSet = undefined;
      if (!this.activeFixture || !this.activeFixture.fixture) return;

      const fixture = this.activeFixture.fixture;
      const conf = await fixture.conf();

      if (conf.default.sets) {
        this.sets = conf.default.sets.map(s => ({ id: s.name, label: s.name, values: s.props }));
      }
    },
  },
  mounted() {
    this.fixtures = fixtures.map(f => {
      return {
        id: f.name,
        label: f.name,
        fixture: f,
      };
    });
  },

  methods: {
    onPropsChange(propValues) {
      this.propValues = { ...propValues };
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-bar {
  top: 0;
  height: calc(100vh);
  padding-top: 0.5rem;
  overflow-x: hidden;
  overflow-y: auto;
  background: #f3f3f3;
}
</style>
