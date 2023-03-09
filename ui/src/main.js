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
import { storeIsLoaded, throwGuardNavigation } from '@/utils/routes';

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
  if (!to.ignoreAnalytics) {
    router.app.$pushAnalyticsIfReady({
      event: 'm2m.PageView',
      to: { name: to.meta && to.meta.label ? to.meta.label : to.name, path: to.path },
    });
  }

  if (to.matched.some((record) => record.meta.permission)) {
    // cette route demande une autorisation, vérifions si l'utilisateur a la permission
    // sinon, redirigeons le sur la page de login.
    throwGuardNavigation(to, store, storeIsLoaded, next);
  } else {
    // assurons-nous de toujours appeler `next()` !
    next();
  }
});

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
