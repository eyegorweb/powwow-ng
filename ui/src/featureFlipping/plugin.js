import FeatureFlippingToggle from './FeatureFlippingToggle';
import WIP from './WIP';
import Permission from '@/featureFlipping/Permission.vue';

export const HIDE_MOCKS = '_ff_hide_mocks';
export const DEBUG_MODE_ON = '_ff_debug_mode';

export function isProdEnv() {
  return location.hostname === 'm2m.by-docapost.com';
}

export function shouldFilterMocked() {
  if (isProdEnv()) {
    return true;
  }

  return !!localStorage.getItem(HIDE_MOCKS);
}

export function isOnDebugMode() {
  if (isProdEnv()) {
    return false;
  }

  return !!localStorage.getItem(DEBUG_MODE_ON);
}

export function excludeMocked(inArray) {
  if (shouldFilterMocked()) {
    return inArray.filter(e => !e.mock);
  }
  return inArray;
}

export default {
  install: Vue => {
    Vue.prototype.$excludeMocked = excludeMocked;
    Vue.prototype.$shouldShowMocks = !shouldFilterMocked();
    Vue.component('ff-toggle', FeatureFlippingToggle);
    Vue.component('ff-wip', WIP);
    Vue.component('permission', Permission);
  },
};
