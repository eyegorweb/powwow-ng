import Vue from 'vue';
import Vuex from 'vuex';

import filters from './filters.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    filters,
  },
});
