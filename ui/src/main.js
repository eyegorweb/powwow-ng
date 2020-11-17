import Vue from 'vue';
import 'moment/locale/fr';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';

import VTooltip from 'v-tooltip';
import FeatureFlipping from './featureFlipping/plugin';
import CommonFunctions from './utils/commonVueFunctions';
import AnalyticsTracking from './utils/analyticsTracking';

import Fragment from 'vue-fragment';

Vue.use(Fragment.Plugin);
Vue.use(VTooltip);
Vue.use(FeatureFlipping);
Vue.use(CommonFunctions);
Vue.use(AnalyticsTracking);

Vue.config.productionTip = false;
Vue.prototype.mina = window.mina;

import $ from 'jquery';
import addGaugeSupport from '@/dep/GaugeMeter.js';

addGaugeSupport($);

router.beforeEach((to, from, next) => {
  router.app.$pushAnalyticsIfReady({ event: 'm2m.PageView', to: { name: to.name, path: to.path } });
  next();
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
