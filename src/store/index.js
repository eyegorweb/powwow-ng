import Vue from 'vue';
import Vuex from 'vuex';

import * as auth from './authentication.module';
import * as getsim from './getsim.module';
import * as ui from './ui.module';
import * as actHistory from './getparc/actHistory.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    getsim,
    auth,
    ui,
    actHistory,
  },
});
