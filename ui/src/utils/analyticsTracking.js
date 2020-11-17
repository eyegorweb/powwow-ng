export default {
  install: Vue => {
    let isReady = false;

    Vue.prototype.$startAnalytics = function() {
      isReady = true;
    };

    Vue.prototype.$pushAnalyticsInternal = function(object, bypassReady) {
      console.log(object);
      if (bypassReady || isReady) {
        const _mtm = (window._mtm = window._mtm || []);

        if (!window._ANALYTICS_DISABLED) {
          _mtm.push(object);
        }
      } else {
        console.log('pushAnalystics is disabled');
      }
    };

    Vue.prototype.$pushAnalytics = function(object) {
      this.$pushAnalyticsInternal(object, true);
    };

    Vue.prototype.$pushAnalyticsIfReady = function(object) {
      this.$pushAnalyticsInternal(object, false);
    };
  },
};
