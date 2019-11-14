import FeatureFlippingToggle from './FeatureFlippingToggle';
import WIP from './WIP';

export const HIDE_MOCKS = '_ff_hide_mocks';

export function isProdEnv() {
  return location.hostname === 'm2m.by-docapost.com';
}

export function shouldFilterMocked() {
  if (isProdEnv()) {
    return true;
  }

  return !!localStorage.getItem(HIDE_MOCKS);
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
    Vue.component('ff-toggle', FeatureFlippingToggle);
    Vue.component('ff-wip', WIP);
  },
};
