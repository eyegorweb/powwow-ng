import Vue from 'vue';
import Vuex from 'vuex';

import auth from './authentication.module';
import filters from './filters.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    filters,
    auth,
  },
});
