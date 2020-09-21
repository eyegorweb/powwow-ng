import get from 'lodash.get';

export default {
  install: Vue => {
    /**
     * Lodash get
     * @param {*} object
     * @param {*} path
     * @param {*} defaultValue
     */
    Vue.prototype.$loGet = (object, path, defaultValue = '') => {
      const value = get(object, path, defaultValue);
      return value !== null ? value : '';
    };
  },
};
