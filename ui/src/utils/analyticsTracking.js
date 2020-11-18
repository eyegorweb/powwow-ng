export default {
  install: Vue => {
    let isReady = false;

    Vue.prototype.$startAnalytics = function() {
      isReady = true;
    };

    const $pushAnalyticsInternal = (object, bypassReady) => {
      if (bypassReady || isReady) {
        const _mtm = (window._mtm = window._mtm || []);

        if (!window._ANALYTICS_DISABLED) {
          _mtm.push(object);
        }
      }
    };

    Vue.prototype.$pushAnalytics = function(object) {
      $pushAnalyticsInternal(object, true);
    };

    Vue.prototype.$pushAnalyticsIfReady = function(object) {
      $pushAnalyticsInternal(object, false);
    };
  },
};
