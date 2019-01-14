import Vue from 'vue';
import Vuex from 'vuex';

import * as auth from './authentication.module';
import * as filters from './filters.module';
import * as orderCreation from './orderCreation.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    filters,
    auth,
    orderCreation,
  },
});
