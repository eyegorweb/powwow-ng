import Vue from 'vue';
import Vuex from 'vuex';

import * as auth from './authentication.module';
import * as filters from './filters.module';
import * as ui from './ui.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    filters,
    auth,
    ui,
  },
});
