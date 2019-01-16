import Vue from 'vue';
import Vuex from 'vuex';

import * as auth from './authentication.module';
import * as filters from './filters.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    filters,
    auth,
  },
});
